import * as z from 'zod'
import {S3Response} from 'react-s3-uploader'
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {Prisma} from '@prisma/client'

import {Schema} from '@storyverse/graphql'
import {Admin} from '@storyverse/web/utils/urls'

import Card from '../../cards/Card'
import Forms from '../../forms/Forms'
import TextInput from '../../forms/TextInput'
import ImageInput from '../../forms/ImageInput'
import Button from '../../buttons/Button'
import TextEditorInput, {EditorValue} from '../../forms/TextEditorInput'
import SeriesSelectInput from './SeriesSelectInput'

export interface UpdateFormProps {
  story?: Schema.StoryDataFragment
}

const schema = z.object({
  name: z.string().nonempty('A name for the Story is required.'),
  season: z.number().optional(),
  issue: z.number().optional(),
  summary: z.string().or(z.record(z.unknown())).optional(),
  content: z.string().or(z.record(z.unknown())).optional(),
  picture: z.string().optional(),
  seriesId: z.string().nonempty('Please select a Series for this Story'),
})

export default function UpdateForm({story}: UpdateFormProps) {
  const id = story?.id
  const [userData] = Schema.useGetCurrentUserQuery()
  const [createData, createStory] = Schema.useCreateStoryMutation()
  const [updateData, updateStory] = Schema.useUpdateStoryMutation()

  const user = userData.data?.getCurrentUser

  const action = id ? 'Update' : 'Create'

  const fetching = createData.fetching || updateData.fetching

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: story?.name || 'New Story',
      season: story?.season,
      issue: story?.issue,
      summary: story?.summary as EditorValue,
      content: story?.content as EditorValue,
      picture: story?.picture || '',
      seriesId: story?.seriesId,
    },
  })

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (id) {
      updateStory({
        id,
        input: {
          ...data,
          summary: data.summary as Prisma.JsonValue,
          content: data.content as Prisma.JsonValue,
        },
      })

      return
    }

    createStory({
      input: {
        ...data,
        summary: data.summary as Prisma.JsonValue,
        content: data.content as Prisma.JsonValue,
      },
    })
  }

  return (
    <Card
      title={`${action} Series`}
      button={{title: 'Back', href: Admin.Series.list(), dark: true}}
    >
      <Forms.Form onSubmit={handleSubmit(onSubmit)}>
        <Forms.Group header="Details">
          <Forms.Field>
            <TextInput
              label="Name"
              error={errors.name?.message}
              {...register('name')}
            />
          </Forms.Field>

          <Forms.Field>
            <SeriesSelectInput
              label="Series"
              error={errors.seriesId?.message}
              {...register('seriesId')}
            />
          </Forms.Field>

          <Forms.Field>
            {user && (
              <ImageInput
                label="Picture"
                name="picture"
                s3path={`${user.username}/`}
                onFinish={handleUpload}
              />
            )}
          </Forms.Field>
        </Forms.Group>

        <Forms.Separator />

        <Forms.Group header="Content">
          <Forms.Field>
            <Controller
              control={control}
              name="summary"
              render={({field: {onChange, onBlur, value}}) => (
                <TextEditorInput
                  label="Summary"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={(errors.summary as {message?: string})?.message}
                />
              )}
            ></Controller>
          </Forms.Field>

          <Forms.Field>
            <Controller
              control={control}
              name="content"
              render={({field: {onChange, onBlur, value}}) => (
                <TextEditorInput
                  label="Content"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={(errors.content as {message?: string})?.message}
                />
              )}
            ></Controller>
          </Forms.Field>
        </Forms.Group>

        <Forms.Actions>
          <Button type="submit" disabled={fetching}>
            Save
          </Button>
        </Forms.Actions>
      </Forms.Form>
    </Card>
  )
}

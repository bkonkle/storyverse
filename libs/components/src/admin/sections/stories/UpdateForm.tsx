import * as z from 'zod'
import clsx from 'clsx'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {Schema, Story} from '@storyverse/graphql'
import {Admin} from '@storyverse/client/utils/urls'

import Card from '../../cards/Card'
import Forms from '../../forms/Forms'
import TextInput from '../../forms/TextInput'
import Button from '../../buttons/Button'
import SeriesSelectInput from './SeriesSelectInput'

export interface UpdateFormProps {
  story?: Schema.StoryDataFragment
}

const schema = z.object({
  name: z.string().nonempty('A name for the Story is required.'),
  volume: z.number().optional(),
  issue: z.number().optional(),
  summary: Story.summary().optional(),
  content: Story.content().optional(),
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
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: story?.name || 'New Story',
      volume: story?.volume,
      issue: story?.issue,
      summary: (story?.summary as Story.Summary) || {},
      content: (story?.content as Story.Content) || {},
      picture: story?.picture || '',
      seriesId: story?.seriesId,
    },
  })

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (id) {
      updateStory({id, input: data})

      return
    }

    createStory({
      input: data,
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
        </Forms.Group>

        <Forms.Group header="Picture">
          <Forms.Field>
            {user && (
              <ReactS3Uploader
                className={clsx('mt-1', 'block', 'w-full')}
                signingUrl="/api/s3/sign"
                signingUrlMethod="GET"
                accept="image/*"
                s3path={`${user.username}/`}
                autoUpload={true}
                onFinish={handleUpload}
              />
            )}
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

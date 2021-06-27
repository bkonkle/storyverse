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
import UniverseSelectInput from './UniverseSelectInput'

export interface UpdateFormProps {
  series?: Schema.SeriesDataFragment
}

const schema = z.object({
  name: z.string().nonempty('A name for the Series is required.'),
  description: z.string().or(z.record(z.unknown())).optional(),
  picture: z.string().optional(),
  universeId: z.string().nonempty('Please select a Universe for this Series.'),
})

export default function UpdateForm({series}: UpdateFormProps) {
  const id = series?.id
  const [userData] = Schema.useGetCurrentUserQuery()
  const [createData, createSeries] = Schema.useCreateSeriesMutation()
  const [updateData, updateSeries] = Schema.useUpdateSeriesMutation()

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
      name: series?.name || 'New Series',
      description: series?.description as EditorValue,
      picture: series?.picture || '',
      universeId: series?.universeId,
    },
  })

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (id) {
      updateSeries({
        id,
        input: {...data, description: data.description as Prisma.JsonValue},
      })

      return
    }

    createSeries({
      input: {
        ...data,
        description: data.description as Prisma.JsonValue,
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
            <UniverseSelectInput
              label="Universe"
              error={errors.universeId?.message}
              {...register('universeId')}
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
              name="description"
              render={({field: {onChange, onBlur, value}}) => (
                <TextEditorInput
                  label="Description"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={(errors.description as {message?: string})?.message}
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

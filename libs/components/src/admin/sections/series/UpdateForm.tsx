import * as z from 'zod'
import clsx from 'clsx'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {Schema, Series} from '@storyverse/graphql'
import {Admin} from '@storyverse/client/utils/urls'

import Card from '../../cards/Card'
import Forms from '../../forms/Forms'
import TextInput from '../../forms/TextInput'
import Button from '../../buttons/Button'
import UniverseSelectInput from './UniverseSelectInput'

export interface UpdateFormProps {
  series?: Schema.SeriesDataFragment
}

const schema = z.object({
  name: z.string().nonempty('A name for the Series is required.'),
  description: Series.description().optional(),
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
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: series?.name || 'New Series',
      description: (series?.description as Series.Description) || {},
      picture: series?.picture || '',
      universeId: series?.universeId,
    },
  })

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (id) {
      updateSeries({id, input: data})

      return
    }

    createSeries({
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
            <UniverseSelectInput
              label="Universe"
              error={errors.universeId?.message}
              {...register('universeId')}
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

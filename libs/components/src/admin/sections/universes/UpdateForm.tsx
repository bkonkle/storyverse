import * as z from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {Schema} from '@storyverse/graphql'

import Card from '../../cards/Card'
import Forms from '../../forms/Forms'
import TextInput from '../../forms/TextInput'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import clsx from 'clsx'
import Button from '../../buttons/Button'
import {Admin} from '@storyverse/shared/config/urls'

export interface UpdateFormProps {
  universe?: Schema.UniverseDataFragment
}

const schema = z.object({
  name: z.string().nonempty('A name for the Universe is required.'),
  description: z.record(z.string()).optional(),
  picture: z.string().optional(),
})

export default function UpdateForm({universe}: UpdateFormProps) {
  const id = universe?.id
  const [userData] = Schema.useGetCurrentUserQuery()
  const [createData, createUniverse] = Schema.useCreateUniverseMutation()
  const [updateData, updateUniverse] = Schema.useUpdateUniverseMutation()

  const user = userData.data?.getCurrentUser
  const profile = user?.profile

  const action = id ? 'Update' : 'Create'

  const fetching = createData.fetching || updateData.fetching

  const {register, handleSubmit, setValue, formState} = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: universe?.name || '',
      description: universe?.description || {},
      picture: universe?.picture || '',
    },
  })

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  console.log(`>- formState.errors ->`, formState.errors)

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!profile) {
      throw new Error('No Profile found for the current User')
    }

    if (id) {
      updateUniverse({id, input: data})

      return
    }

    createUniverse({
      input: {
        ...data,
        ownerProfileId: profile.id,
      },
    })
  }

  return (
    <Card
      title={`${action} Universe`}
      button={{title: 'Back', href: Admin.Universes.list(), dark: true}}
    >
      <Forms.Form onSubmit={handleSubmit(onSubmit)}>
        <Forms.Group header="Details">
          <Forms.Field>
            <TextInput
              label="Name"
              defaultValue="New Universe"
              error={formState.errors.name?.message}
              {...register('name', {required: true})}
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

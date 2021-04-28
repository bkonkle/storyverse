import * as z from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {
  useGetCurrentUserQuery,
  useCreateUniverseMutation,
  useUpdateUniverseMutation,
} from '@storyverse/graphql/Schema'

import Card from '../../cards/Card'
import Forms from '../../forms/Forms'
import TextInput from '../../forms/TextInput'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import clsx from 'clsx'
import Button from '../../buttons/Button'

export interface UpdateUniverseProps {
  id?: string
}

const schema = z.object({
  name: z.string().nonempty('A name for the Universe is required.'),
  picture: z.string().optional(),
})

export default function UpdateUniverse({id}: UpdateUniverseProps) {
  const [{data}] = useGetCurrentUserQuery()
  const [createData, createUniverse] = useCreateUniverseMutation()
  const [updateData, updateUniverse] = useUpdateUniverseMutation()
  const {register, handleSubmit, setValue, formState} = useForm({
    resolver: zodResolver(schema),
  })

  const user = data?.getCurrentUser
  const profile = user?.profile
  const fetching = createData.fetching || updateData.fetching

  const action = id ? 'Update' : 'Create'

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

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

  if (Object.keys(formState.errors).length) {
    console.error(`>- formState.errors ->`, formState.errors)
  }

  return (
    <Card title={`${action} Universe`}>
      <Forms.Form onSubmit={handleSubmit(onSubmit)}>
        <Forms.Group header="Details">
          <Forms.Field>
            <TextInput
              label="Name"
              defaultValue="New Universe"
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

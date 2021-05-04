import * as z from 'zod'
import clsx from 'clsx'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from '@storyverse/graphql/Schema'

import Card from '../../cards/Card'
import TextInput from '../../forms/TextInput'
import Forms from '../../forms/Forms'
import Button from '../../buttons/Button'

const schema = z.object({
  displayName: z.string().optional(),
  email: z.string().nonempty({message: 'An email address is required.'}),
  picture: z.string().optional(),
})

export default function ProfileForm() {
  const [{data}] = useGetCurrentUserQuery()
  const [{fetching}, updateProfile] = useUpdateProfileMutation()
  const {register, handleSubmit, setValue, formState} = useForm({
    resolver: zodResolver(schema),
  })

  const user = data?.getCurrentUser
  const profile = user?.profile

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!profile?.id) {
      throw new Error('No Profile id found')
    }

    updateProfile({
      id: profile.id,
      input: data,
    })
  }

  if (Object.keys(formState.errors).length) {
    console.error(`>- formState.errors ->`, formState.errors)
  }

  return (
    <Card large title="My Profile">
      <Forms.Form onSubmit={handleSubmit(onSubmit)}>
        <Forms.Group header="Contact Info">
          <Forms.Field half>
            <TextInput
              label="Display Name"
              defaultValue={profile?.displayName || undefined}
              {...register('displayName')}
            />
          </Forms.Field>

          <Forms.Field half>
            {/* Disabled for now */}
            <TextInput
              label="Email Address"
              defaultValue={profile?.email || undefined}
              disabled
              {...register('email', {required: true})}
            />
          </Forms.Field>
        </Forms.Group>

        <Forms.Separator />

        <Forms.Group header="Photo">
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

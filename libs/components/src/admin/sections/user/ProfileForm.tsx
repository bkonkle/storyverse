import * as z from 'zod'
import clsx from 'clsx'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import {useForm} from 'react-hook-form'

import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from '@storyverse/graphql/Schema'

import {zodResolver} from '../../../utils/zod'
import FormCard from '../../cards/FormCard'
import TextInput from '../../forms/TextInput'
import Forms from '../../forms/Forms'
import Button from '../../buttons/Button'

const schema = z.object({
  displayName: z.string().optional(),
  email: z.string().nonempty({message: 'An email address is required.'}),
  picture: z.string().optional(),
})

export const ProfileForm = () => {
  const [{data}] = useGetCurrentUserQuery()
  const [{fetching}, updateProfile] = useUpdateProfileMutation()
  const {register, handleSubmit, setValue, errors} = useForm({
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

  if (Object.keys(errors).length) {
    console.error(`>- errors ->`, errors)
  }

  return (
    <FormCard title="My Profile" onSubmit={handleSubmit(onSubmit)}>
      <Forms.Group header="Contact Info">
        <Forms.Field half>
          <TextInput
            name="displayName"
            label="Display Name"
            defaultValue={profile?.displayName || undefined}
            ref={register}
          />
        </Forms.Field>

        <Forms.Field half>
          <TextInput
            name="email"
            label="Email Address"
            defaultValue={profile?.email || undefined}
            ref={register}
          />
        </Forms.Field>
      </Forms.Group>

      <Forms.Separator />

      <Forms.Group header="Photo">
        <Forms.Field full>
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
    </FormCard>
  )
}

export default ProfileForm

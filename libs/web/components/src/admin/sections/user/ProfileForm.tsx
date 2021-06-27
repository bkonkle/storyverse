import * as z from 'zod'
import clsx from 'clsx'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {useUpdateProfileMutation} from '@storyverse/graphql/Schema'

import Card from '../../cards/Card'
import TextInput from '../../forms/TextInput'
import Forms from '../../forms/Forms'
import Button from '../../buttons/Button'
import {Schema} from '@storyverse/graphql'

export interface ProfileFormProps {
  user: Schema.UserDataFragment
  profile: Schema.ProfileDataFragment
}

const schema = z.object({
  displayName: z.string().optional(),
  email: z.string().nonempty({message: 'An email address is required.'}),
  location: z.string().optional(),
  picture: z.string().optional(),
})

export default function ProfileForm({user, profile}: ProfileFormProps) {
  const [{fetching}, updateProfile] = useUpdateProfileMutation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: profile.email || '',
      displayName: profile.displayName || '',
      location: '',
      picture: profile.picture || '',
    },
  })

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateProfile({
      id: profile.id,
      input: data,
    })
  }

  return (
    <Card large title="My Profile">
      <Forms.Form onSubmit={handleSubmit(onSubmit)}>
        <Forms.Group header="Contact Info">
          <Forms.Field half>
            <TextInput
              label="Display Name"
              error={errors.displayName?.message}
              {...register('displayName')}
            />
          </Forms.Field>

          <Forms.Field half>
            <TextInput
              label="Location"
              error={errors.displayName?.message}
              {...register('location')}
            />
          </Forms.Field>

          <Forms.Field>
            <TextInput
              label="Email Address"
              error={errors.email?.message}
              hint="Currently read-only."
              readOnly
              {...register('email')}
            />
          </Forms.Field>
        </Forms.Group>

        <Forms.Separator />

        <Forms.Group header="Picture">
          <Forms.Field>
            <ReactS3Uploader
              className={clsx('mt-1', 'block', 'w-full')}
              signingUrl="/api/s3/sign"
              signingUrlMethod="GET"
              accept="image/*"
              s3path={`${user.username}/`}
              autoUpload={true}
              onFinish={handleUpload}
            />
            {errors.picture?.message && (
              <div className="block text-red-600 text-sm my-2">
                {errors.picture.message}
              </div>
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

import * as z from 'zod'
import clsx from 'clsx'
import ReactS3Uploader, {S3Response} from 'react-s3-uploader'
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {Schema, Universe} from '@storyverse/graphql'
import {Admin} from '@storyverse/client/utils/urls'

import Card from '../../cards/Card'
import Forms from '../../forms/Forms'
import TextInput from '../../forms/TextInput'
import Button from '../../buttons/Button'
import TextEditorInput from '../../forms/TextEditorInput'

export interface UpdateFormProps {
  universe?: Schema.UniverseDataFragment
}

const schema = z.object({
  name: z.string().nonempty('A name for the Universe is required.'),
  description: Universe.description().optional(),
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

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: universe?.name || 'New Universe',
      description: (universe?.description as Universe.Description)?.quill || '',
      picture: universe?.picture || '',
    },
  })

  const handleUpload = (response: S3Response, _file: File) => {
    setValue('picture', `${process.env.BASE_URL}${response.publicUrl}`)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!profile) {
      throw new Error('No Profile found for the current User')
    }

    console.log(`>- data ->`, data)

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
      large
      title={`${action} Universe`}
      button={{title: 'Back', href: Admin.Universes.list(), dark: true}}
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

        <Forms.Separator />

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

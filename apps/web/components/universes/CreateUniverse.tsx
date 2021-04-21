import React from 'react'
import clsx from 'clsx'
import {useForm} from 'react-hook-form'
import ReactS3Uploader from 'react-s3-uploader'
import * as z from 'zod'

import Field from '../forms/Field'
import Input from '../forms/Input'
import FormButton from '../forms/FormButton'
import Textarea from '../forms/Textarea'
import {
  useGetCurrentUserQuery,
  useCreateUniverseMutation,
} from '@storyverse/graphql/Schema'
import {zodResolver} from '../../utils/zod'

const schema = z.object({
  name: z.string().nonempty({message: 'A name is required.'}),
  description: z.string(),
  picture: z.string(),
})

export const CreateUniverse = () => {
  const [userData] = useGetCurrentUserQuery()
  const [_, createUniverse] = useCreateUniverseMutation()
  const user = userData.data?.getCurrentUser

  const {register, handleSubmit, setValue, errors} = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!user?.profile?.id) {
      throw new Error('No User profile id found')
    }

    createUniverse({
      input: {
        ...data,
        ownerProfileId: user.profile.id,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={clsx('max-w-md')}>
        <div className={clsx('grid', 'grid-cols-1', 'gap-6')}>
          <Field label="Name">
            <Input
              name="name"
              type="text"
              error={errors.name}
              placeholder="My Incredible Universe"
              ref={register}
            />
          </Field>
          <Field label="Description">
            <Textarea name="description" ref={register} rows={10} />
          </Field>
          <Field label="Picture">
            {user && (
              <ReactS3Uploader
                className={clsx('mt-1', 'block', 'w-full')}
                signingUrl="/api/s3/sign"
                signingUrlMethod="GET"
                accept="image/*"
                s3path={`${user.username}/`}
                autoUpload={true}
                onFinish={(response, _file) => {
                  setValue(
                    'picture',
                    `${process.env.BASE_URL}${response.publicUrl}`
                  )
                }}
              />
            )}
            <Input name="picture" type="hidden" ref={register} />
          </Field>
          <div className={clsx('flex flex-row-reverse')}>
            <FormButton primary>Create</FormButton>
            <FormButton>Cancel</FormButton>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CreateUniverse

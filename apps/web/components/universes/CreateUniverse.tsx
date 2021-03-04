import React from 'react'
import clsx from 'clsx'
import {useForm} from 'react-hook-form'

import Field from '../forms/Field'
import Input from '../forms/Input'
import FormButton from '../forms/FormButton'
import Textarea from '../forms/Textarea'
import ReactS3Uploader from 'react-s3-uploader'
import {useGetCurrentUserQuery} from '../../data/Schema'

export const CreateUniverse = () => {
  const [{data}] = useGetCurrentUserQuery()
  const user = data?.getCurrentUser

  const {register, handleSubmit} = useForm()

  function onSubmit(data: unknown) {
    console.log(`>- data ->`, data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={clsx('max-w-md')}>
        <div className={clsx('grid', 'grid-cols-1', 'gap-6')}>
          <Field label="Name">
            <Input
              name="name"
              type="text"
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
                s3path={`uploads/${user.username}/`}
                autoUpload={true}
                onProgress={(...args) => {
                  console.log(args)
                }}
              />
            )}
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

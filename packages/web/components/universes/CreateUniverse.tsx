import React from 'react'
import clsx from 'clsx'
import {useForm} from 'react-hook-form'

import Field from '../forms/Field'
import Input from '../forms/Input'
import FormButton from '../forms/FormButton'

export const CreateUniverse = () => {
  const {register, handleSubmit, errors} = useForm()

  console.log(`>- errors ->`, errors)

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
            <Input name="description" type="text" ref={register} />
          </Field>
          <Field label="Picture">
            {/* TODO: https://github.com/odysseyscience/react-s3-uploader */}
            <Input
              name="picture"
              type="file"
              accept="image/png, image/jpeg"
              ref={register}
            />
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

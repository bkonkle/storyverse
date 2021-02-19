import React from 'react'
import clsx from 'clsx'

import Field from '../forms/Field'
import Input from '../forms/Input'
import Select from '../forms/Select'
import Textarea from '../forms/Textarea'
import CheckboxField from '../forms/CheckboxField'
import CheckboxItem from '../forms/CheckboxItem'

export const CreateUniverse = () => {
  return (
    <>
      <div className={clsx('mt-8', 'max-w-md')}>
        <div className={clsx('grid', 'grid-cols-1', 'gap-6')}>
          <Field label="Full name">
            <Input type="text" placeholder="" />
          </Field>
          <Field label="Email address">
            <Input type="email" placeholder="john@example.com" />
          </Field>
          <Field label="When is your event?">
            <Input type="date" />
          </Field>
          <Field label="What type of event is it?">
            <Select>
              <option>Corporate event</option>
              <option>Wedding</option>
              <option>Birthday</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Additional details">
            <Textarea />
          </Field>
          <CheckboxField>
            <CheckboxItem>Email me news and special offers</CheckboxItem>
          </CheckboxField>
        </div>
      </div>
    </>
  )
}

export default CreateUniverse

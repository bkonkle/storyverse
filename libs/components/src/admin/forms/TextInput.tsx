import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  useMemo,
} from 'react'
import clsx from 'clsx'
import {ulid} from 'ulid'

import {Input, inputClasses} from './Forms'

export interface TextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
  error?: string
  hint?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({label, className, error, hint, ...rest}: TextInputProps, ref) => {
    const id = useMemo(() => ulid(), [])

    return (
      <Input id={id} label={label} error={error} hint={hint}>
        <input
          id={id}
          {...rest}
          className={clsx(inputClasses, className)}
          ref={ref}
        />
      </Input>
    )
  }
)

export default TextInput

import {
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  forwardRef,
  useMemo,
} from 'react'
import clsx from 'clsx'
import {ulid} from 'ulid'

import {Input, inputClasses} from './Forms'

export interface TextAreaInputProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
  error?: string
  hint?: string
}

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(
  (
    {
      name,
      label,
      error,
      hint,
      rows = 4,
      className,
      ...rest
    }: TextAreaInputProps,
    ref
  ) => {
    const id = useMemo(() => ulid(), [])

    return (
      <Input id={id} label={label} error={error} hint={hint}>
        <textarea
          id={id}
          name={name}
          {...rest}
          className={clsx(inputClasses, className)}
          rows={rows}
          ref={ref}
        ></textarea>
      </Input>
    )
  }
)

export default TextAreaInput

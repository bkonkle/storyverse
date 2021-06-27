import {
  DetailedHTMLProps,
  SelectHTMLAttributes,
  forwardRef,
  useMemo,
} from 'react'
import clsx from 'clsx'
import {ulid} from 'ulid'

import {Input, inputClasses} from './Forms'

export interface SelectInputProps
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  label: string
  error?: string
  hint?: string
  options?: {value: string; label?: string}[]
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {label, className, error, hint, options, ...rest}: SelectInputProps,
    ref
  ) => {
    const id = useMemo(() => ulid(), [])

    return (
      <Input id={id} label={label} error={error} hint={hint}>
        <select
          id={id}
          {...rest}
          className={clsx(inputClasses, className)}
          ref={ref}
        >
          {options?.map(({value, label}) => (
            <option key={value} value={value}>
              {label || value}
            </option>
          ))}
        </select>
      </Input>
    )
  }
)

export default SelectInput

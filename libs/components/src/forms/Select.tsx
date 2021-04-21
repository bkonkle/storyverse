import React from 'react'
import clsx from 'clsx'

export type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>

export const Select = (props: SelectProps) => {
  const {className, children, ...rest} = props

  return (
    <select
      className={clsx(
        'block',
        'w-full',
        'mt-1',
        'rounded-md',
        'border-gray-300',
        'shadow-sm',
        'focus:border-indigo-300',
        'focus:ring',
        'focus:ring-indigo-200',
        'focus:ring-opacity-50',
        className
      )}
      {...rest}
    >
      {children}
    </select>
  )
}

export default Select

import React from 'react'
import clsx from 'clsx'

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const Input = (props: InputProps) => {
  const {className, children, ...rest} = props

  return (
    <input
      className={clsx(
        'mt-1',
        'block',
        'w-full',
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
    </input>
  )
}

export default Input

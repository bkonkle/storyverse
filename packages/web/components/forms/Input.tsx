import React, {forwardRef} from 'react'
import clsx from 'clsx'

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {className, children, type, ...rest} = props

  const isFile = type === 'file'

  return (
    <input
      type={type}
      className={clsx(
        'mt-1',
        'block',
        'w-full',
        isFile || [
          'rounded-md',
          'border-gray-300',
          'shadow-sm',
          'focus:border-teal-300',
          'focus:ring',
          'focus:ring-teal-200',
          'focus:ring-opacity-50',
        ],
        className
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </input>
  )
})

export default Input

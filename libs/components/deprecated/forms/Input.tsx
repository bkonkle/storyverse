import React, {forwardRef} from 'react'
import clsx from 'clsx'
import {FieldError} from 'react-hook-form'

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: FieldError
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {className, children, type, error, ...rest} = props

  return (
    <>
      <input
        type={type}
        className={clsx(
          type !== 'hidden' && [
            'mt-1',
            'block',
            'w-full',
            'rounded-md',
            'border-gray-300',
            'shadow-sm',
            'focus:border-teal-300',
            'focus:ring',
            'focus:ring-teal-200',
            'focus:ring-opacity-50',
          ],
          error && [
            'focus:border-red-300',
            'focus:ring-red-200',
            'border-red-300',
          ],
          className
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </input>
      {error?.message && (
        <p className={clsx('text-sm', 'text-red-500')}>{error.message}</p>
      )}
    </>
  )
})

export default Input

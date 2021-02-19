import React from 'react'
import clsx from 'clsx'

export type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

export const Textarea = (props: TextareaProps) => {
  const {className, children, ...rest} = props

  return (
    <textarea
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
    </textarea>
  )
}

export default Textarea

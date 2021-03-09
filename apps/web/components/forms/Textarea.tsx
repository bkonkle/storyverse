import React, {forwardRef} from 'react'
import clsx from 'clsx'

export type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
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
          'focus:border-teal-300',
          'focus:ring',
          'focus:ring-teal-200',
          'focus:ring-opacity-50',
          className
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </textarea>
    )
  }
)

export default Textarea

import React from 'react'
import clsx from 'clsx'

export interface FormButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  primary?: boolean
}

export const FormButton = (props: FormButtonProps) => {
  const {children, className, primary, ...rest} = props

  return (
    <button
      className={clsx(
        'px-3',
        'py-2',
        'ml-4',
        'rounded-md',
        'font-medium',
        primary
          ? ['text-white', 'bg-teal-400', 'hover:bg-teal-500']
          : ['text-gray-600', 'bg-gray-200', 'hover:bg-gray-300'],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default FormButton

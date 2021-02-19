import React from 'react'
import clsx from 'clsx'

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  active?: boolean
}

export const Button = (props: ButtonProps) => {
  const {active, children, className, ...rest} = props

  return (
    <button
      className={clsx(
        active ? 'text-teal-400' : 'text-gray-300',
        'bg-teal-100',
        'hover:text-white',
        'hover:bg-teal-400',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-teal-300',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

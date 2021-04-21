import React from 'react'
import clsx from 'clsx'

export interface NavButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  active?: boolean
}

export const NavButton = (props: NavButtonProps) => {
  const {active, children, className, ...rest} = props

  return (
    <button
      className={clsx(
        'text-teal-400',
        active || 'opacity-40',
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

export default NavButton

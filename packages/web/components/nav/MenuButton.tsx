import React from 'react'
import clsx from 'clsx'

export interface MenuButtonProps {
  open: boolean
  setOpen: (state: boolean) => void
}

export const getClasses = (props: MenuButtonProps) => {
  const {open} = props

  return {
    container: clsx('-mr-2', 'flex', 'md:hidden'),

    button: clsx(
      'bg-gray-800',
      'inline-flex',
      'items-center',
      'justify-center',
      'p-2',
      'rounded-md',
      'text-gray-400',
      'hover:text-white',
      'hover:bg-gray-700',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-offset-gray-800',
      'focus:ring-white'
    ),

    open: clsx('sr-only'),

    icon: clsx('h-6', 'w-6', open && 'block'),
  }
}

/**
 * Menu Button - only on small screens
 */
export const MenuButton = (props: MenuButtonProps) => {
  const {open, setOpen} = props
  const classes = getClasses(props)

  return (
    <div className={classes.container}>
      <button
        className={classes.button}
        aria-expanded="false"
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
      >
        <span className={classes.open}>Open main menu</span>
        <svg
          className={classes.icon}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          {open ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
    </div>
  )
}

export default MenuButton

import React, {RefObject, FocusEvent} from 'react'
import clsx from 'clsx'

export interface MenuButtonProps {
  open: boolean
  slideMenu: RefObject<HTMLDivElement>
  setOpen: (state: boolean) => void
}

export const getClasses = (props: MenuButtonProps) => {
  const {open} = props

  return {
    container: clsx('-mr-2', 'flex', 'md:hidden'),

    button: clsx(
      'bg-teal-100',
      'inline-flex',
      'items-center',
      'justify-center',
      'p-2',
      'rounded-md',
      'text-teal-400',
      'hover:text-white',
      'hover:bg-teal-400',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-teal-400'
    ),

    open: clsx('sr-only'),

    icon: clsx('h-6', 'w-6', open && 'block'),
  }
}

export const handleBlur = (
  slideMenu: RefObject<HTMLDivElement>,
  setOpen: (state: boolean) => void
) => (event: FocusEvent<HTMLButtonElement>) => {
  // Workaround an issue where links clicked on the menu don't activate because the
  // element disappears too quickly.
  if (
    slideMenu.current &&
    Array.from(slideMenu.current.querySelectorAll('*')).includes(
      event.relatedTarget as HTMLElement
    )
  ) {
    console.log('FOUND')
    return setTimeout(() => setOpen(false), 500)
  }

  setOpen(false)
}

/**
 * Menu Button - only on small screens
 */
export const MenuButton = (props: MenuButtonProps) => {
  const {open, setOpen, slideMenu} = props
  const classes = getClasses(props)

  return (
    <div className={classes.container}>
      <button
        className={classes.button}
        aria-expanded="false"
        onClick={() => setOpen(!open)}
        onBlur={handleBlur(slideMenu, setOpen)}
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

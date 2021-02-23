import React, {RefObject, FocusEvent} from 'react'
import clsx from 'clsx'

import NavButton from './NavButton'

export interface MenuButtonProps {
  open: boolean
  slideMenu: RefObject<HTMLDivElement>
  setOpen: (state: boolean) => void
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

  return (
    <div className={clsx('-mr-2', 'flex', 'md:hidden')}>
      <NavButton
        active
        className={clsx(
          'inline-flex',
          'items-center',
          'justify-center',
          'p-2',
          'rounded-md'
        )}
        aria-expanded="false"
        onClick={() => setOpen(!open)}
        onBlur={handleBlur(slideMenu, setOpen)}
      >
        <span className={clsx('sr-only')}>Open main menu</span>
        <svg
          className={clsx('h-6', 'w-6', open && 'block')}
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
      </NavButton>
    </div>
  )
}

export default MenuButton

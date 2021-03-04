import React, {RefObject} from 'react'
import clsx from 'clsx'

import NavLink from './NavLink'

export interface NavProfileLinksProps {
  dropdown?: boolean
  profileLinks?: RefObject<HTMLDivElement>
}

export const NavProfileLinks = (props: NavProfileLinksProps) => {
  const {dropdown, profileLinks} = props

  const containerClasses = dropdown
    ? clsx(
        'origin-top-right',
        'absolute',
        'right-0',
        'mt-2',
        'w-48',
        'rounded-md',
        'shadow-lg',
        'py-1',
        'bg-white',
        'ring-1',
        'ring-black',
        'ring-opacity-5'
      )
    : clsx('mt-3', 'px-2', 'space-y-1')

  return (
    <div
      className={containerClasses}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu"
      ref={profileLinks}
    >
      <NavLink dropdown={dropdown} href="#" profile>
        Your Profile
      </NavLink>
      <NavLink dropdown={dropdown} href="#" profile>
        Settings
      </NavLink>
      <NavLink dropdown={dropdown} href="/api/logout" profile>
        Sign out
      </NavLink>
    </div>
  )
}

export default NavProfileLinks

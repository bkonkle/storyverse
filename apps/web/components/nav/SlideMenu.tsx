import React, {RefObject} from 'react'
import clsx from 'clsx'
import NavLinks from './NavLinks'
import Nameplate from './Nameplate'

import NavProfileLinks from './NavProfileLinks'
import Notifications from './Notifications'
import NavLink from './NavLink'
import {useGetCurrentUserQuery} from '../../data/Schema'

export interface SlideMenuProps {
  open: boolean
  slideMenu: RefObject<HTMLDivElement>
  image?: string
}

/**
 * The SlideMenu slides down from the top on devices with smaller screens.
 */
export const SlideMenu = (props: SlideMenuProps) => {
  const {image, slideMenu, open} = props
  const [{fetching, data}] = useGetCurrentUserQuery()

  if (fetching) {
    return null
  }

  const user = data?.getCurrentUser

  return (
    <div
      className={clsx(open ? 'block' : ['hidden', 'md:hidden'])}
      ref={slideMenu}
    >
      <NavLinks slide />
      <div className={clsx('pt-4', 'pb-3', 'border-t', 'border-gray-700')}>
        {user ? (
          <>
            <div className={clsx('flex', 'items-center', 'px-5')}>
              <div className={clsx('flex-shrink-0')}>
                <img
                  className={clsx('h-10', 'w-10', 'rounded-full')}
                  src={image}
                  alt=""
                />
              </div>
              <Nameplate />
              <Notifications slide />
            </div>
            <NavProfileLinks />
          </>
        ) : (
          <div className={clsx('px-2', 'pt-2', 'pb-3', 'space-y-1', 'sm:px-3')}>
            <NavLink slide href="/api/auth/login">
              Login
            </NavLink>
          </div>
        )}
      </div>
    </div>
  )
}

SlideMenu.defaultProps = {
  image:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

export default SlideMenu

import React, {RefObject} from 'react'
import clsx from 'clsx'
import {signIn} from 'next-auth/client'

import {useGetCurrentUserQuery} from '@storyverse/graphql/Schema'
import NavLinks from './NavLinks'
import NavLink from './NavLink'
import Nameplate from './Nameplate'
import NavProfileLinks from './NavProfileLinks'
import Notifications from './Notifications'

export interface SlideMenuProps {
  open: boolean
  slideMenu: RefObject<HTMLDivElement>
}

export const handleLogin = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()

  signIn('auth0')
}

/**
 * The SlideMenu slides down from the top on devices with smaller screens.
 */
export const SlideMenu = (props: SlideMenuProps) => {
  const {slideMenu, open} = props
  const [{fetching, data}] = useGetCurrentUserQuery()

  if (fetching) {
    return null
  }

  const user = data?.getCurrentUser
  const image = user?.profile?.picture

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
                {image && (
                  <img
                    className={clsx('h-10', 'w-10', 'rounded-full')}
                    src={image}
                    alt=""
                  />
                )}
              </div>
              <Nameplate
                name={user.profile?.displayName}
                email={user.profile?.email}
              />
              <Notifications slide />
            </div>
            <NavProfileLinks />
          </>
        ) : (
          <div className={clsx('px-2', 'pt-2', 'pb-3', 'space-y-1', 'sm:px-3')}>
            <NavLink slide onClick={handleLogin}>
              Login
            </NavLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlideMenu

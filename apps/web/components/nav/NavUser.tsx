import React from 'react'
import clsx from 'clsx'
import {signIn} from 'next-auth/client'

import NavProfile from './NavProfile'
import Notifications from './Notifications'
import NavLink from './NavLink'
import {useGetCurrentUserQuery} from '../../data/Schema'

export const handleLogin = (
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()

  signIn()
}

export const NavUser = () => {
  const [{fetching, data}] = useGetCurrentUserQuery()

  if (fetching) {
    return null
  }

  const user = data?.getCurrentUser

  const containerClasses = clsx('hidden', 'md:block')

  if (!user) {
    return (
      <div className={containerClasses}>
        <NavLink onClick={handleLogin}>Login</NavLink>
      </div>
    )
  }

  return (
    <div className={containerClasses}>
      <div className={clsx('ml-4', 'flex', 'items-center', 'md:ml-6')}>
        <Notifications />
        <NavProfile />
      </div>
    </div>
  )
}

export default NavUser

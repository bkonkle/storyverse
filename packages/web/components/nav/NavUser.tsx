import React from 'react'
import clsx from 'clsx'

import NavProfile from './NavProfile'
import Notifications from './Notifications'
import NavLink from './NavLink'
import {useStore} from '../../data/Store'

export const getClasses = () => {
  return {
    profileContainer: clsx('hidden', 'md:block'),

    profile: clsx('ml-4', 'flex', 'items-center', 'md:ml-6'),
  }
}

export const NavUser = () => {
  const classes = getClasses()
  const {user, loading} = useStore((state) => state.users)

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <div className={classes.profileContainer}>
        <NavLink href="/api/login">Login</NavLink>
      </div>
    )
  }

  return (
    <div className={classes.profileContainer}>
      <div className={classes.profile}>
        <Notifications />
        <NavProfile />
      </div>
    </div>
  )
}

export default NavUser

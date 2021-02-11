import React from 'react'
import clsx from 'clsx'

import {useUser} from '../../data/UserData'
import NavProfile from './NavProfile'
import Notifications from './Notifications'
import NavLink from './NavLink'

export const getClasses = () => {
  return {
    profileContainer: clsx('hidden', 'md:block'),

    profile: clsx('ml-4', 'flex', 'items-center', 'md:ml-6'),
  }
}

export const NavUser = () => {
  const classes = getClasses()
  const {user, loading} = useUser()

  if (loading) {
    return null
  }

  if (!user) {
    return <NavLink href="/api/login">Login</NavLink>
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

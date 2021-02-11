import React, {useState} from 'react'
import clsx from 'clsx'

import MenuButton from './MenuButton'
import NavProfile from './NavProfile'
import SlideMenu from './SlideMenu'
import Notifications from './Notifications'
import MenuLinks from './MenuLinks'

export const getClasses = () => {
  return {
    container: clsx('bg-gray-800'),

    header: clsx('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8'),

    topbarContainer: clsx('flex', 'items-center', 'justify-between', 'h-16'),

    topbar: clsx('flex', 'items-center'),

    titleContainer: clsx('flex-shrink-0'),

    title: clsx('text-3xl', 'font-bold', 'leading-tight', 'text-white'),

    menuLinks: clsx('hidden', 'md:block'),

    profileContainer: clsx('hidden', 'md:block'),

    profile: clsx('ml-4', 'flex', 'items-center', 'md:ml-6'),
  }
}

export const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const classes = getClasses()

  return (
    <nav className={classes.container}>
      <div className={classes.header}>
        <div className={classes.topbarContainer}>
          <div className={classes.topbar}>
            <div className={classes.titleContainer}>
              <h1 className={classes.title}>Storyverse</h1>
            </div>

            <div className={classes.menuLinks}>
              <MenuLinks />
            </div>
          </div>

          <div className={classes.profileContainer}>
            <div className={classes.profile}>
              <Notifications />
              <NavProfile />
            </div>
          </div>

          <MenuButton open={menuOpen} setOpen={setMenuOpen} />
        </div>
      </div>

      <SlideMenu open={menuOpen} />
    </nav>
  )
}

export default Navigation

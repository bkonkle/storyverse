import clsx from 'clsx'
import MenuLinks from './MenuLinks'
import Nameplate from './Nameplate'

import NavProfileLinks from './NavProfileLinks'
import Notifications from './Notifications'

export interface SlideMenuProps {
  open: boolean
  image?: string
}

export const getClasses = (props: SlideMenuProps) => {
  const {open} = props

  return {
    container: clsx(open ? 'block' : ['hidden', 'md:hidden']),

    profileContainer: clsx('pt-4', 'pb-3', 'border-t', 'border-gray-700'),

    profile: clsx('flex', 'items-center', 'px-5'),

    image: clsx('flex-shrink-0'),

    avatar: clsx('h-10', 'w-10', 'rounded-full'),
  }
}

/**
 * The SlideMenu slides down from the top on devices with smaller screens.
 */
export const SlideMenu = (props: SlideMenuProps) => {
  const {image} = props
  const classes = getClasses(props)

  return (
    <div className={classes.container}>
      <MenuLinks slide />
      <div className={classes.profileContainer}>
        <div className={classes.profile}>
          <div className={classes.image}>
            <img className={classes.avatar} src={image} alt="" />
          </div>
          <Nameplate />
          <Notifications slide />
        </div>
        <NavProfileLinks />
      </div>
    </div>
  )
}

export default SlideMenu

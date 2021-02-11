import clsx from 'clsx'
import NavProfileLink from './NavProfileLink'

export interface NavProfileLinksProps {
  dropdown?: boolean
}

export const getClasses = (props: NavProfileLinksProps) => {
  const {dropdown} = props

  if (dropdown) {
    return {
      container: clsx(
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
      ),
    }
  }

  return {
    container: clsx('mt-3', 'px-2', 'space-y-1'),
  }
}

export const NavProfileLinks = (props: NavProfileLinksProps) => {
  const {dropdown} = props
  const classes = getClasses(props)

  return (
    <div
      className={classes.container}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu"
    >
      <NavProfileLink dropdown={dropdown} href="#">
        Your Profile
      </NavProfileLink>
      <NavProfileLink dropdown={dropdown} href="#">
        Settings
      </NavProfileLink>
      <NavProfileLink dropdown={dropdown} href="#">
        Sign out
      </NavProfileLink>
    </div>
  )
}

export default NavProfileLinks

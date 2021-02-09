import React, {useState} from 'react'
import clsx from 'clsx'
import {Transition} from '@headlessui/react'

import NavLink from './NavLink'

interface NavProfileProps {
  image: string
}

export const getClasses = (_props: NavProfileProps) => {
  return {
    container: clsx('ml-3', 'relative'),

    button: clsx(
      'bg-gray-800',
      'flex',
      'text-sm',
      'rounded-full',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'focus:ring-offset-gray-800',
      'focus:ring-white'
    ),

    open: clsx('sr-only'),

    avatar: clsx('h-8', 'w-8', 'rounded-full'),

    dropdown: clsx(
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
      'ring-black ring-opacity-5'
    ),
  }
}

export const NavProfile = (props: NavProfileProps) => {
  const {image} = props
  const [show, setShow] = useState<boolean>(false)
  const classes = getClasses(props)

  return (
    <div className={classes.container}>
      <div>
        <button
          className={classes.button}
          id="user-menu"
          aria-haspopup="true"
          onClick={() => setShow(!show)}
          onBlur={() => setShow(false)}
        >
          <span className={classes.open}>Open user menu</span>
          <img className={classes.avatar} src={image} alt=""></img>
        </button>
      </div>
      <Transition show={show}>
        <Transition.Child
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            className={classes.dropdown}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <NavLink href="#" profile>
              Your Profile
            </NavLink>
            <NavLink href="#" profile>
              Settings
            </NavLink>
            <NavLink href="#" profile>
              Sign out
            </NavLink>
          </div>
        </Transition.Child>
      </Transition>
    </div>
  )
}

NavProfile.defaultProps = {
  image:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

export default NavProfile

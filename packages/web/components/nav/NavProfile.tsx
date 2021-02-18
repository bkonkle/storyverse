import React, {FocusEvent, RefObject, useRef, useState} from 'react'
import clsx from 'clsx'
import {Transition} from '@headlessui/react'

import NavProfileLinks from './NavProfileLinks'
import {Controls} from '../Styles'

interface NavProfileProps {
  image: string
}

export const getClasses = (_props: NavProfileProps) => {
  return {
    container: clsx('ml-3', 'relative'),

    button: clsx(
      'max-w-xs',
      'rounded-full',
      'flex',
      'items-center',
      'text-sm',
      Controls.button()
    ),

    open: clsx('sr-only'),

    avatar: clsx('h-8', 'w-8', 'rounded-full'),
  }
}

export const handleBlur = (
  profileLinks: RefObject<HTMLDivElement>,
  setShow: (state: boolean) => void
) => (event: FocusEvent<HTMLButtonElement>) => {
  // Workaround an issue where links clicked on the menu don't activate because the
  // element disappears too quickly.
  if (
    profileLinks.current &&
    Array.from(profileLinks.current.querySelectorAll('*')).includes(
      event.relatedTarget as HTMLElement
    )
  ) {
    return setTimeout(() => setShow(false), 500)
  }

  setShow(false)
}

export const NavProfile = (props: NavProfileProps) => {
  const {image} = props
  const [show, setShow] = useState(false)
  const profileLinks = useRef<HTMLDivElement>(null)
  const classes = getClasses(props)

  return (
    <div className={classes.container}>
      <div>
        <button
          className={classes.button}
          id="user-menu"
          aria-haspopup="true"
          onClick={() => setShow(!show)}
          onBlur={handleBlur(profileLinks, setShow)}
        >
          <span className={classes.open}>Open user menu</span>
          <img className={classes.avatar} src={image} alt="" />
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
          <NavProfileLinks profileLinks={profileLinks} dropdown />
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

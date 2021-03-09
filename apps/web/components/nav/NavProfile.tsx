import React, {FocusEvent, RefObject, useRef, useState} from 'react'
import clsx from 'clsx'
import {Transition} from '@headlessui/react'

import NavProfileLinks from './NavProfileLinks'
import NavButton from './NavButton'

interface NavProfileProps {
  image?: string
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

  return (
    <div className={clsx('ml-3', 'relative')}>
      <div>
        <NavButton
          active
          className={clsx(
            'max-w-xs',
            'rounded-full',
            'flex',
            'items-center',
            'text-sm'
          )}
          id="user-menu"
          aria-haspopup="true"
          onClick={() => setShow(!show)}
          onBlur={handleBlur(profileLinks, setShow)}
        >
          <span className={clsx('sr-only')}>Open user menu</span>
          <img
            className={clsx('h-8', 'w-8', 'rounded-full')}
            src={image}
            alt=""
          />
        </NavButton>
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

export default NavProfile

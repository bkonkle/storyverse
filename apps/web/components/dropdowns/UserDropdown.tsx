import React, {useState, createRef} from 'react'
import clsx from 'clsx'
import {createPopper} from '@popperjs/core'

export default function UserDropdown() {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false)
  const btnDropdownRef = createRef<HTMLAnchorElement>()
  const popoverDropdownRef = createRef<HTMLDivElement>()

  const openDropdownPopover = () => {
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    createPopper(btnDropdownRef.current!, popoverDropdownRef.current!, {
      placement: 'bottom-start',
    })
    setDropdownPopoverShow(true)
  }

  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false)
  }

  return (
    <>
      <a
        className={clsx('text-blueGray-500', 'block')}
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault()
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover()
        }}
      >
        <div className={clsx('items-center', 'flex')}>
          <span
            className={clsx(
              'w-12',
              'h-12',
              'text-sm',
              'text-white',
              'bg-blueGray-200',
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-full'
            )}
          >
            <img
              alt="..."
              className={clsx(
                'w-full',
                'rounded-full',
                'align-middle',
                'border-none',
                'shadow-lg'
              )}
              src="https://demos.creative-tim.com/notus-nextjs/img/team-1-800x800.jpg"
            />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={clsx(
          dropdownPopoverShow ? 'block ' : 'hidden',
          'bg-white',
          'text-base',
          'z-50',
          'float-left',
          'py-2',
          'list-none',
          'text-left',
          'rounded',
          'shadow-lg',
          'min-w-48'
        )}
      >
        <a
          href="#pablo"
          className={clsx(
            'text-sm',
            'py-2',
            'px-4',
            'font-normal',
            'block',
            'w-full',
            'whitespace-nowrap',
            'bg-transparent',
            'text-blueGray-700'
          )}
          onClick={(e) => e.preventDefault()}
        >
          Action
        </a>
        <a
          href="#pablo"
          className={clsx(
            'text-sm',
            'py-2',
            'px-4',
            'font-normal',
            'block',
            'w-full',
            'whitespace-nowrap',
            'bg-transparent',
            'text-blueGray-700'
          )}
          onClick={(e) => e.preventDefault()}
        >
          Another action
        </a>
        <a
          href="#pablo"
          className={clsx(
            'text-sm',
            'py-2',
            'px-4',
            'font-normal',
            'block',
            'w-full',
            'whitespace-nowrap',
            'bg-transparent',
            'text-blueGray-700'
          )}
          onClick={(e) => e.preventDefault()}
        >
          Something else here
        </a>
        <div
          className={clsx(
            'h-0',
            'my-2',
            'border',
            'border-solid',
            'border-blueGray-100'
          )}
        />
        <a
          href="#pablo"
          className={clsx(
            'text-sm',
            'py-2',
            'px-4',
            'font-normal',
            'block',
            'w-full',
            'whitespace-nowrap',
            'bg-transparent',
            'text-blueGray-700'
          )}
          onClick={(e) => e.preventDefault()}
        >
          Separated link
        </a>
      </div>
    </>
  )
}

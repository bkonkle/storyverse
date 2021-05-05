import clsx from 'clsx'
import {
  AnchorHTMLAttributes,
  HTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  createRef,
  useState,
} from 'react'
import NextLink from 'next/link'
import {createPopper} from '@popperjs/core'

export interface DropdownProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  icon?: boolean
  toggle: ReactNode
  toggleProps?: Omit<
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    'children'
  >
}

export function Dropdown({
  className,
  icon,
  toggle,
  toggleProps,
  children,
  ...rest
}: DropdownProps) {
  const {className: toggleClassName, ...toggleRest} = toggleProps || {}

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
        className={clsx('text-blueGray-500', 'block', className)}
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault()
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover()
        }}
        {...toggleRest}
      >
        <div className={clsx('items-center', 'flex')}>
          <span
            className={clsx(
              'w-12',
              'h-12',
              'text-sm',
              'inline-flex',
              'items-center',
              'justify-center',
              'rounded-full'
            )}
          >
            {toggle}
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
          'min-w-48',
          className
        )}
        {...rest}
      >
        {children}
      </div>
    </>
  )
}

export interface LinkProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  href: string
}

export function Link({className, href, children, ...rest}: LinkProps) {
  return (
    <NextLink href={href}>
      <a
        className={clsx(
          'text-sm',
          'py-2',
          'px-4',
          'font-normal',
          'block',
          'w-full',
          'whitespace-nowrap',
          'bg-transparent',
          'text-blueGray-700',
          className
        )}
        {...rest}
      >
        {children}
      </a>
    </NextLink>
  )
}

export function Separator() {
  return (
    <div
      className={clsx(
        'h-0',
        'my-2',
        'border',
        'border-solid',
        'border-blueGray-100'
      )}
    />
  )
}

import clsx from 'clsx'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {MouseEventHandler, ReactNode} from 'react'

export interface SidebarLinkProps {
  children: ReactNode
  href: string
  icon: string
  iconStyle?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const NARROW_ICONS = ['fa-clipboard-list', 'fa-book']

export default function SidebarLink({
  href,
  icon,
  iconStyle = 'fas',
  children,
  onClick,
}: SidebarLinkProps) {
  const router = useRouter()

  const link = (
    <a
      href={href}
      onClick={onClick}
      className={clsx(
        'text-xs',
        'uppercase',
        'py-3',
        'font-bold',
        'block',
        href !== '/' && router.pathname.indexOf(href) !== -1
          ? ['text-lightBlue-500', 'hover:text-lightBlue-600']
          : ['text-blueGray-700', 'hover:text-blueGray-500']
      )}
    >
      <i
        className={clsx(
          iconStyle,
          icon,
          NARROW_ICONS.includes(icon) ? 'mr-3' : 'mr-2',
          'text-sm',
          href !== '/' && router.pathname.indexOf(href) !== -1
            ? 'opacity-75'
            : 'text-blueGray-300'
        )}
      ></i>{' '}
      {children}
    </a>
  )

  return (
    <li className="items-center">
      <Link href={href}>{link}</Link>
    </li>
  )
}

import React, {ReactNode} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import {useRouter} from 'next/router'

export interface SidebarLinkProps {
  href: string
  icon: string
  iconStyle?: string
  children: ReactNode
}

const NARROW_ICONS = ['fa-clipboard-list', 'fa-book']

export default function SidebarLink({
  href,
  icon,
  iconStyle = 'fas',
  children,
}: SidebarLinkProps) {
  const router = useRouter()

  return (
    <li className="items-center">
      <Link href={href}>
        <a
          href={href}
          className={clsx(
            'text-xs',
            'uppercase',
            'py-3',
            'font-bold',
            'block',
            router.pathname.indexOf(href) !== -1
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
              router.pathname.indexOf(href) !== -1
                ? 'opacity-75'
                : 'text-blueGray-300'
            )}
          ></i>{' '}
          {children}
        </a>
      </Link>
    </li>
  )
}

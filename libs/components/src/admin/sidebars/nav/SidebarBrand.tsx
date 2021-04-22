import Link from 'next/link'
import clsx from 'clsx'

export interface SidebarBrandProps {
  title: string
}

export default function SidebarBrand({title}: SidebarBrandProps) {
  return (
    <Link href="/">
      <a
        href="#pablo"
        className={clsx(
          'md:block',
          'text-left',
          'md:pb-2',
          'text-blueGray-600',
          'mr-0',
          'inline-block',
          'whitespace-nowrap',
          'text-sm',
          'uppercase',
          'font-bold',
          'p-4',
          'px-0'
        )}
      >
        {title}
      </a>
    </Link>
  )
}

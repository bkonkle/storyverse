import {ReactNode} from 'react'
import clsx from 'clsx'

export interface SidebarHeadingProps {
  children: ReactNode
}

export default function SidebarHeading({children}: SidebarHeadingProps) {
  return (
    <>
      <hr className="my-4 md:min-w-full" />
      <h6
        className={clsx(
          'md:min-w-full',
          'text-blueGray-500',
          'text-xs',
          'uppercase',
          'font-bold',
          'block',
          'pt-1',
          'pb-4',
          'no-underline'
        )}
      >
        {children}
      </h6>
    </>
  )
}

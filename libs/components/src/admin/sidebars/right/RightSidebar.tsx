import {ReactNode} from 'react'
import clsx from 'clsx'

export interface RightSidebarProps {
  children: ReactNode
}

export const RightSidebar = ({children}: RightSidebarProps) => {
  return (
    <div
      className={clsx(
        'relative',
        'flex',
        'flex-col',
        'min-w-0',
        'break-words',
        'bg-white',
        'w-full',
        'mb-6',
        'shadow-xl',
        'rounded-lg',
        'mt-16'
      )}
    >
      <div className="px-6">{children}</div>
    </div>
  )
}

export default RightSidebar

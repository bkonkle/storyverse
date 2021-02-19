import React, {ReactNode} from 'react'
import clsx from 'clsx'

export interface PageHeaderProps {
  children: ReactNode
}

export const PageHeader = (props: PageHeaderProps) => {
  const {children} = props

  return (
    <>
      <header className={clsx('bg-white', 'shadow')}>
        <div
          className={clsx(
            'max-w-7xl',
            'mx-auto',
            'py-6',
            'px-4',
            'sm:px-6',
            'lg:px-8'
          )}
        >
          <h1
            className={clsx(
              'text-3xl',
              'font-bold',
              'leading-tight',
              'text-gray-900'
            )}
          >
            {children}
          </h1>
        </div>
      </header>
    </>
  )
}

export default PageHeader

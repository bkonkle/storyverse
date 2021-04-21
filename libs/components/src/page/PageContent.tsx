import React, {ReactNode} from 'react'
import clsx from 'clsx'

export interface PageContentProps {
  children: ReactNode
}

export const PageContent = (props: PageContentProps) => {
  const {children} = props

  return (
    <main>
      <div
        className={clsx('max-w-7xl', 'mx-auto', 'py-6', 'sm:px-6', 'lg:px-8')}
      >
        <div className={clsx('px-4', 'py-6', 'sm:px-0')}>{children}</div>
      </div>
    </main>
  )
}

export default PageContent

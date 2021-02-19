import React from 'react'
import clsx from 'clsx'

export interface NameplateProps {
  name: string
  email: string
}

const defaultProps: NameplateProps = {
  name: 'Tom Cook',
  email: 'tom@example.com',
}

export const Nameplate = (props: NameplateProps) => {
  const {name, email} = props

  return (
    <div className={clsx('ml-3')}>
      <div
        className={clsx(
          'text-base',
          'font-medium',
          'leading-none',
          'text-teal-800'
        )}
      >
        {name}
      </div>
      <div
        className={clsx(
          'text-sm',
          'font-medium',
          'leading-none',
          'text-teal-600'
        )}
      >
        {email}
      </div>
    </div>
  )
}

Nameplate.defaultProps = defaultProps

export default Nameplate

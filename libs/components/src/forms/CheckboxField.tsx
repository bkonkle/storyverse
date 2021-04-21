import React, {ReactNode} from 'react'
import clsx from 'clsx'

export interface CheckboxFieldProps {
  children: ReactNode
  label?: string
}

export const CheckboxField = (props: CheckboxFieldProps) => {
  const {children, label} = props

  return (
    <div className={clsx('block')}>
      {label && <span className="text-gray-700">{label}</span>}
      <div className={clsx('mt-2')}>{children}</div>
    </div>
  )
}

export default CheckboxField

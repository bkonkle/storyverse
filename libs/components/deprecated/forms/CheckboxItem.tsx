import React, {ReactNode} from 'react'
import clsx from 'clsx'

export interface CheckboxItemProps {
  children: ReactNode
}

export const CheckboxItem = (props: CheckboxItemProps) => {
  const {children} = props

  return (
    <div>
      <label className={clsx('inline-flex', 'items-center')}>
        <input
          type="checkbox"
          className={clsx(
            'rounded',
            'border-gray-300',
            'text-indigo-600',
            'shadow-sm',
            'focus:border-indigo-300',
            'focus:ring',
            'focus:ring-indigo-200',
            'focus:ring-opacity-50'
          )}
        />
        <span className={clsx('ml-2')}>{children}</span>
      </label>
    </div>
  )
}

export default CheckboxItem

import React, {ReactNode} from 'react'

export interface FieldProps {
  label?: string
  children: ReactNode
}

export const Field = (props: FieldProps) => {
  const {children, label} = props

  return (
    <label className="block">
      {label && <span className="text-gray-700">{label}</span>}
      {children}
    </label>
  )
}

export default Field

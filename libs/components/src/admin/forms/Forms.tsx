import clsx from 'clsx'
import {ReactNode} from 'react'

export interface HeaderProps {
  children: ReactNode
}

export function Header({children}: HeaderProps) {
  return (
    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
      {children}
    </h6>
  )
}

export const Separator = () => (
  <hr className="mt-6 border-b-1 border-blueGray-300" />
)

export interface GroupProps {
  header?: string
  children?: ReactNode
}

export function Group({header, children}: GroupProps) {
  return (
    <>
      {header && <Header>{header}</Header>}

      <div className="flex flex-wrap">{children}</div>
    </>
  )
}

export interface ActionsProps {
  children?: ReactNode
}

export function Actions({children}: ActionsProps) {
  return <div className="flex justify-end mt-12">{children}</div>
}

export interface FieldProps {
  full?: boolean
  half?: boolean
  third?: boolean
  children?: ReactNode
}

export function Field({full, half, third, children}: FieldProps) {
  return (
    <div
      className={clsx(
        'w-full',
        full
          ? 'lg:w-12/12'
          : half
          ? 'lg:w-6/12'
          : third
          ? 'lg:w-4/12'
          : undefined,
        'px-4'
      )}
    >
      {children}
    </div>
  )
}

export default {Header, Separator, Group, Actions, Field}

import clsx from 'clsx'
import {FormEventHandler, ReactNode} from 'react'

export interface FormProps {
  children: ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function Form({children, onSubmit}: FormProps) {
  return (
    <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form onSubmit={onSubmit}>{children}</form>
    </div>
  )
}

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
  half?: boolean
  third?: boolean
  children?: ReactNode
}

export function Field({half, third, children}: FieldProps) {
  return (
    <div
      className={clsx(
        'w-full',
        half
          ? 'lg:w-6/12'
          : third
          ? 'lg:w-4/12'
          : // full
            'lg:w-12/12',
        'px-4'
      )}
    >
      {children}
    </div>
  )
}

export interface InputProps {
  id: string
  label: string
  error?: string
  hint?: string
  children?: ReactNode
}

export function Input({id, label, error, hint, children}: InputProps) {
  return (
    <div className="relative w-full mb-3">
      <label
        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      {children}
      {hint && <div className="text-gray-400 text-xs my-2">{hint}</div>}
      {error && <div className="block text-red-600 text-sm my-2">{error}</div>}
    </div>
  )
}

export const inputClasses = clsx(
  'border-0',
  'px-3',
  'py-3',
  'placeholder-blueGray-300',
  'text-blueGray-600',
  'bg-white',
  'rounded',
  'text-sm',
  'shadow',
  'focus:outline-none',
  'focus:ring',
  'w-full',
  'ease-linear',
  'transition-all',
  'duration-150',
)

export default {Form, Header, Separator, Group, Actions, Field, inputClasses}

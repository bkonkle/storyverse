import clsx from 'clsx'
import {ButtonHTMLAttributes, DetailedHTMLProps, ReactNode} from 'react'

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: ReactNode
}

export default function Button({children, className, ...rest}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        'bg-blueGray-700',
        'active:bg-blueGray-600',
        'text-white',
        'font-bold',
        'uppercase',
        'text-xs',
        'px-4',
        'py-2',
        'rounded',
        'shadow',
        'hover:shadow-md',
        'outline-none',
        'focus:outline-none',
        'mr-1',
        'ease-linear',
        'transition-all',
        'duration-150',
        className
      )}
    >
      {children}
    </button>
  )
}

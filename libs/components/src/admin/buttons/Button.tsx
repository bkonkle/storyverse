import clsx from 'clsx'
import {ButtonHTMLAttributes, DetailedHTMLProps, ReactNode} from 'react'

export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children?: ReactNode
  dark?: boolean
  small?: boolean
  large?: boolean
}

export default function Button({
  children,
  className,
  dark,
  small,
  large,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        dark
          ? ['bg-blueGray-700', 'active:bg-blueGray-600']
          : ['bg-indigo-500', 'active:bg-indigo-600'],
        'text-white',
        'font-bold',
        'uppercase',
        'text-xs',
        large && ['px-4', 'py-2'],
        !large && ['px-3', 'py-1'],
        small && ['mb-1'],
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

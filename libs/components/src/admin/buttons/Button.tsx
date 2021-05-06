import clsx from 'clsx'
import Link from 'next/link'
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  DetailedHTMLProps,
} from 'react'
import {UnionToIntersection} from 'type-fest'

export interface ButtonProps
  extends UnionToIntersection<
    | DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >
    | DetailedHTMLProps<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
      >
  > {
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
  href,
  ...rest
}: ButtonProps) {
  const classes = clsx(
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
  )

  if (href) {
    return (
      <Link href={href}>
        <a {...rest} className={classes}>
          {children}
        </a>
      </Link>
    )
  }

  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  )
}

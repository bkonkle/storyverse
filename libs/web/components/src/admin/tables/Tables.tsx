import clsx from 'clsx'
import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  TableHTMLAttributes,
} from 'react'
import NextLink from 'next/link'

export interface TableProps
  extends DetailedHTMLProps<
    TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  headers: string[]
  dark?: boolean
}

export function Table({
  className,
  children,
  headers,
  dark,
  ...rest
}: TableProps) {
  return (
    <div className="block w-full overflow-x-auto">
      <table
        {...rest}
        className={clsx(
          'items-center',
          'w-full',
          'bg-transparent',
          'border-collapse',
          className
        )}
      >
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className={clsx(
                  'px-6',
                  'align-middle',
                  'border',
                  'border-solid',
                  'py-3',
                  'text-xs',
                  'uppercase',
                  'border-l-0',
                  'border-r-0',
                  'whitespace-nowrap',
                  'font-semibold',
                  'text-left',
                  dark && [
                    'bg-blueGray-600',
                    'text-blueGray-200',
                    'border-blueGray-500',
                  ],
                  !dark && [
                    'bg-blueGray-50',
                    'text-blueGray-500',
                    'border-blueGray-100',
                  ]
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export interface RowProps {
  children?: ReactNode
  className?: string
}

export function Row({children, className}: RowProps) {
  return <tr className={className}>{children}</tr>
}

export interface ColumnProps {
  children?: ReactNode
  className?: string
  header?: boolean
}

export function Column({children, className, header}: ColumnProps) {
  const classes = clsx(
    'border-t-0',
    'px-6',
    'align-middle',
    'border-l-0',
    'border-r-0',
    'text-xs',
    'whitespace-nowrap',
    'p-4',
    className
  )

  if (header) {
    return <th className={classes}>{children}</th>
  }

  return <td className={classes}>{children}</td>
}

export interface LinkProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  href: string
}

export function Link({className, href, children, ...rest}: LinkProps) {
  return (
    <NextLink href={href}>
      <a
        className={clsx(
          'w-full',
          'whitespace-nowrap',
          'text-lightBlue-500',
          'hover:text-lightBlue-600',
          className
        )}
        {...rest}
      >
        {children}
      </a>
    </NextLink>
  )
}

export default {Table, Row, Column, Link}

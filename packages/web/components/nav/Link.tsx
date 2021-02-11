import React, {ReactNode} from 'react'
import NextLink from 'next/link'

export interface LinkProps {
  children?: ReactNode
  className: string
  external?: boolean
  href: string
}

export const Link = (props: LinkProps) => {
  const {children, className, external, href} = props

  if (external) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href}>
      <a className={className}>{children}</a>
    </NextLink>
  )
}

export default Link

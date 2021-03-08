import React from 'react'
import NextLink from 'next/link'

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean
}

export const Link = (props: LinkProps) => {
  const {children, external, href, ...rest} = props

  if (external || !href) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href}>
      <a href={href} {...rest}>
        {children}
      </a>
    </NextLink>
  )
}

export default Link

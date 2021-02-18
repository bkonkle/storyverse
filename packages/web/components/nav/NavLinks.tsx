import React from 'react'
import clsx from 'clsx'

import NavLink from './NavLink'

export enum Pages {
  Home,
  Stories,
  Series,
  Universes,
}

export interface NavLinksProps {
  slide?: boolean
  currentPage?: Pages
}

export const getClasses = (props: NavLinksProps) => {
  const {slide} = props

  if (slide) {
    return {
      links: clsx('px-2', 'pt-2', 'pb-3', 'space-y-1', 'sm:px-3'),
    }
  }

  return {
    links: clsx('ml-10', 'flex', 'items-baseline', 'space-x-4'),
  }
}

export const NavLinks = (props: NavLinksProps) => {
  const {currentPage, slide} = props
  const classes = getClasses(props)

  return (
    <div className={classes.links}>
      <NavLink slide={slide} href="/home" current={currentPage === Pages.Home}>
        Home
      </NavLink>
      <NavLink
        slide={slide}
        href="/universes"
        current={currentPage === Pages.Universes}
      >
        Universes
      </NavLink>
      <NavLink
        slide={slide}
        href="/series"
        current={currentPage === Pages.Series}
      >
        Series
      </NavLink>
      <NavLink
        slide={slide}
        href="/stories"
        current={currentPage === Pages.Stories}
      >
        Stories
      </NavLink>
    </div>
  )
}

export default NavLinks

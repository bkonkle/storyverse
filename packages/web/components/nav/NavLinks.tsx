import React from 'react'
import clsx from 'clsx'

import {Pages, useStore} from '../../data/Store'
import NavLink from './NavLink'

export interface NavLinksProps {
  slide?: boolean
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
  const {slide} = props
  const classes = getClasses(props)
  const {page} = useStore((state) => state.pages)

  return (
    <div className={classes.links}>
      <NavLink slide={slide} href="/home" current={page === Pages.Home}>
        Home
      </NavLink>
      <NavLink
        slide={slide}
        href="/universes"
        current={page === Pages.Universes}
      >
        Universes
      </NavLink>
      <NavLink slide={slide} href="/series" current={page === Pages.Series}>
        Series
      </NavLink>
      <NavLink slide={slide} href="/stories" current={page === Pages.Stories}>
        Stories
      </NavLink>
    </div>
  )
}

export default NavLinks

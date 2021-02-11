import React from 'react'
import clsx from 'clsx'

import NavLink from './NavLink'

export interface MenuLinksProps {
  slide?: boolean
}

export const getClasses = (props: MenuLinksProps) => {
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

export const MenuLinks = (props: MenuLinksProps) => {
  const {slide} = props
  const classes = getClasses(props)

  return (
    <div className={classes.links}>
      <NavLink slide={slide} href="#" current>
        Home
      </NavLink>
      <NavLink slide={slide} href="#">
        Stories
      </NavLink>
      <NavLink slide={slide} href="#">
        Series
      </NavLink>
      <NavLink slide={slide} href="#">
        Universes
      </NavLink>
    </div>
  )
}

export default MenuLinks

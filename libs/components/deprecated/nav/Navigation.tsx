import React, {useRef, useState} from 'react'
import clsx from 'clsx'

import MenuButton from './MenuButton'
import SlideMenu from './SlideMenu'
import NavLinks from './NavLinks'
import NavUser from './NavUser'

export const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const slideMenu = useRef<HTMLDivElement>(null)

  return (
    <nav className={clsx('bg-teal-100')}>
      <div
        className={clsx('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')}
      >
        <div
          className={clsx('flex', 'items-center', 'justify-between', 'h-16')}
        >
          <div className={clsx('flex', 'items-center')}>
            <div className={clsx('flex-shrink-0')}>
              <h1
                className={clsx(
                  'text-3xl',
                  'font-bold',
                  'leading-tight',
                  'text-teal-900'
                )}
              >
                Storyverse
              </h1>
            </div>

            <div className={clsx('hidden', 'md:block')}>
              <NavLinks />
            </div>
          </div>

          <NavUser />

          <MenuButton
            open={menuOpen}
            setOpen={setMenuOpen}
            slideMenu={slideMenu}
          />
        </div>
      </div>

      <SlideMenu open={menuOpen} slideMenu={slideMenu} />
    </nav>
  )
}

export default Navigation

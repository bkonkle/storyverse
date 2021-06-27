import {useState} from 'react'
import Link from 'next/link'
import clsx from 'clsx'

import Urls from '@storyverse/web/utils/urls'

import SidebarBrand from './SidebarBrand'
import SidebarUser from './SidebarUser'
import SidebarSearch from './SidebarSearch'
import SidebarLinks from './SidebarLinks'

export interface SidebarProps {
  title: string
}

export default function NavSidebar({title}: SidebarProps) {
  const [collapseShow, setCollapseShow] = useState(['hidden'])

  return (
    <nav
      className={clsx(
        'md:left-0',
        'md:block',
        'md:fixed',
        'md:top-0',
        'md:bottom-0',
        'md:overflow-y-auto',
        'md:flex-row',
        'md:flex-nowrap',
        'md:overflow-hidden',
        'shadow-xl',
        'bg-white',
        'flex',
        'flex-wrap',
        'items-center',
        'justify-between',
        'relative',
        'md:w-64',
        'z-10',
        'py-4',
        'px-6'
      )}
    >
      <div
        className={clsx(
          'md:flex-col',
          'md:items-stretch',
          'md:min-h-full',
          'md:flex-nowrap',
          'px-0',
          'flex',
          'flex-wrap',
          'items-center',
          'justify-between',
          'w-full',
          'mx-auto'
        )}
      >
        {/* Toggler */}
        <button
          className={clsx(
            'cursor-pointer',
            'text-black',
            'opacity-50',
            'md:hidden',
            'px-3',
            'py-1',
            'text-xl',
            'leading-none',
            'bg-transparent',
            'rounded',
            'border',
            'border-solid',
            'border-transparent'
          )}
          type="button"
          onClick={() => setCollapseShow(['bg-white', 'm-2', 'py-3', 'px-6'])}
        >
          <i className="fas fa-bars"></i>
        </button>

        <SidebarBrand title={title} />

        <SidebarUser />

        {/* Collapse */}
        <div
          className={clsx(
            'md:flex',
            'md:flex-col',
            'md:items-stretch',
            'md:opacity-100',
            'md:relative',
            'md:mt-4',
            'md:shadow-none',
            'shadow',
            'absolute',
            'top-0',
            'left-0',
            'right-0',
            'z-40',
            'overflow-y-auto',
            'overflow-x-hidden',
            'h-auto',
            'items-center',
            'flex-1',
            'rounded',
            collapseShow
          )}
        >
          {/* Collapse header */}
          <div
            className={clsx(
              'md:min-w-full',
              'md:hidden',
              'block',
              'pb-4',
              'mb-4',
              'border-b',
              'border-solid',
              'border-blueGray-200'
            )}
          >
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <Link href="/">
                  <a
                    href={Urls.home()}
                    className={clsx(
                      'md:block',
                      'text-left',
                      'md:pb-2',
                      'text-blueGray-600',
                      'mr-0',
                      'inline-block',
                      'whitespace-nowrap',
                      'text-sm',
                      'uppercase',
                      'font-bold',
                      'p-4',
                      'px-0'
                    )}
                  >
                    {title}
                  </a>
                </Link>
              </div>
              <div className="w-6/12 flex justify-end">
                <button
                  type="button"
                  className={clsx(
                    'cursor-pointer',
                    'text-black',
                    'opacity-50',
                    'md:hidden',
                    'px-3',
                    'py-1',
                    'text-xl',
                    'leading-none',
                    'bg-transparent',
                    'rounded',
                    'border',
                    'border-solid',
                    'border-transparent'
                  )}
                  onClick={() => setCollapseShow(['hidden'])}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <SidebarSearch />

          <SidebarLinks />
        </div>
      </div>
    </nav>
  )
}

NavSidebar.defaultProps = {
  title: 'Storyverse',
}

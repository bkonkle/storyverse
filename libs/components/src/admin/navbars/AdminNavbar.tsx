import clsx from 'clsx'

import UserDropdown from '../dropdowns/UserDropdown'

export default function Navbar() {
  return (
    <nav
      className={clsx(
        'absolute',
        'top-0',
        'left-0',
        'w-full',
        'z-10',
        'bg-transparent',
        'md:flex-row',
        'md:flex-nowrap',
        'md:justify-start',
        'flex',
        'items-center',
        'p-4'
      )}
    >
      <div
        className={clsx(
          'w-full',
          'mx-autp',
          'items-center',
          'flex',
          'justify-between',
          'md:flex-nowrap',
          'flex-wrap',
          'md:px-10',
          'px-4'
        )}
      >
        {/* Brand */}
        <a
          className={clsx(
            'text-white',
            'text-sm',
            'uppercase',
            'hidden',
            'lg:inline-block',
            'font-semibold'
          )}
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          Dashboard
        </a>
        {/* Form */}
        <form
          className={clsx(
            'md:flex',
            'hidden',
            'flex-row',
            'flex-wrap',
            'items-center',
            'lg:ml-auto mr-3'
          )}
        >
          <div
            className={clsx(
              'relative',
              'flex',
              'w-full',
              'flex-wrap',
              'items-stretch'
            )}
          >
            <span
              className={clsx(
                'z-10',
                'h-full',
                'leading-snug',
                'font-normal',
                'absolute',
                'text-center',
                'text-blueGray-300',
                'bg-transparent',
                'rounded',
                'text-base',
                'items-center',
                'justify-center',
                'w-8',
                'pl-3',
                'py-3'
              )}
            >
              <i className={clsx('fas', 'fa-search')}></i>
            </span>
            <input
              type="text"
              placeholder="Search here..."
              className={clsx(
                'border-0',
                'px-3',
                'py-3',
                'placeholder-blueGray-300',
                'text-blueGray-600',
                'relative',
                'bg-white',
                'rounded',
                'text-sm',
                'shadow',
                'outline-none',
                'focus:outline-none',
                'focus:ring',
                'w-full',
                'pl-10'
              )}
            />
          </div>
        </form>
        {/* User */}
        <ul
          className={clsx(
            'flex-col',
            'md:flex-row',
            'list-none',
            'items-center',
            'hidden',
            'md:flex'
          )}
        >
          <UserDropdown />
        </ul>
      </div>
    </nav>
  )
}

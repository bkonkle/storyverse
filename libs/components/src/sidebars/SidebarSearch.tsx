import React from 'react'
import clsx from 'clsx'

export default function SidebarSearch() {
  return (
    <form className="mt-6 mb-4 md:hidden">
      <div className="mb-3 pt-0">
        <input
          type="text"
          placeholder="Search"
          className={clsx(
            'border-0',
            'px-3',
            'py-2',
            'h-12',
            'border-solid',
            'border-blueGray-500',
            'placeholder-blueGray-300',
            'text-blueGray-600',
            'bg-white',
            'rounded',
            'text-base',
            'leading-snug',
            'shadow-none',
            'outline-none',
            'focus:outline-none',
            'w-full',
            'font-normal'
          )}
        />
      </div>
    </form>
  )
}

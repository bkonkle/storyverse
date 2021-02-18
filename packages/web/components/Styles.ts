import clsx from 'clsx'

export namespace Page {
  export const header = ['bg-white', 'shadow']

  export const titleContainer = [
    'max-w-7xl',
    'mx-auto',
    'py-6',
    'px-4',
    'sm:px-6',
    'lg:px-8',
  ]

  export const title = [
    'text-3xl',
    'font-bold',
    'leading-tight',
    'text-gray-900',
  ]

  export const pageContainer = [
    'max-w-7xl',
    'mx-auto',
    'py-6',
    'sm:px-6',
    'lg:px-8',
  ]

  export const page = ['px-4', 'py-6', 'sm:px-0']

  export const pageHeader = {
    header: clsx(header),
    titleContainer: clsx(titleContainer),
    title: clsx(title),
    pageContainer: clsx(pageContainer),
    page: clsx(page),
  }
}

export namespace Section {
  export const title = ['text-2xl', 'font-bold', 'leading-tight', 'mb-4']
}

export namespace Controls {
  export interface ButtonProps {
    active?: boolean
  }

  export const button = ({active}: ButtonProps = {}) => [
    active ? 'text-teal-400' : 'text-gray-300',
    'bg-teal-100',
    'hover:text-white',
    'hover:bg-teal-400',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-teal-300',
  ]
}

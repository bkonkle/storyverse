import {ReactNode, MouseEventHandler} from 'react'
import clsx from 'clsx'
import Button from '../buttons/Button'

export interface FormProps {
  children?: ReactNode
  category?: string
  title: string
  small?: boolean
  large?: boolean
  dark?: boolean
  button?: {
    title: string
    href?: string
    dark?: boolean
    onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  }
}

export default function Card({
  children,
  category,
  title,
  button,
  small,
  large,
  dark,
}: FormProps) {
  return (
    <div
      className={clsx(
        'relative',
        'flex',
        'flex-col',
        'min-w-0',
        'break-words',
        'w-full',
        'mb-6',
        'shadow-lg',
        large && ['rounded-lg'],
        !large && ['rounded'],
        dark && ['bg-blueGray-700', 'text-white'],
        !dark && !large && ['bg-white'],
        !dark && large && ['bg-blueGray-100']
      )}
    >
      <div
        className={clsx(
          'rounded-t',
          'mb-0',
          large && ['px-6', 'py-6'],
          large && !dark && ['bg-white'],
          !large && ['px-4', 'py-3', 'bg-transparent']
        )}
      >
        <div className="flex flex-wrap items-center">
          <div
            className={clsx(
              'relative',
              'w-full',
              !large && 'px-4',
              'max-w-full',
              'flex-grow',
              'flex-1'
            )}
          >
            {category && (
              <h6
                className={clsx(
                  'uppercase',
                  'mb-1',
                  'text-xs',
                  'font-semibold',
                  dark && ['text-blueGray-100'],
                  !dark && ['text-blueGray-400']
                )}
              >
                {category}
              </h6>
            )}

            {small && (
              <h3
                className={clsx(
                  'font-semibold',
                  'text-base',
                  dark && ['text-white'],
                  !dark && ['text-blueGray-700']
                )}
              >
                {title}
              </h3>
            )}

            {!small && (
              <h2
                className={clsx(
                  large ? ['font-bold'] : ['font-semibold'],
                  'text-xl',
                  dark && ['text-white'],
                  !dark && ['text-blueGray-700']
                )}
              >
                {title}
              </h2>
            )}
          </div>
          {button && (
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <Button
                small={small}
                large={large}
                dark={button.dark || large}
                onClick={button.onClick}
                href={button.href}
                type="button"
              >
                {button.title}
              </Button>
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

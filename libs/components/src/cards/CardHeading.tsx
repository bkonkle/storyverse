import clsx from 'clsx'
import {MouseEventHandler} from 'react'

export interface CardHeadingProps {
  title: string
  button?: {
    title: string
    onClick: MouseEventHandler<HTMLButtonElement>
  }
}

export const CardHeading = ({title, button}: CardHeadingProps) => {
  return (
    <div className="rounded-t bg-white mb-0 px-6 py-6">
      <div className="text-center flex justify-between">
        <h6 className="text-blueGray-700 text-xl font-bold">{title}</h6>
        {button && (
          <button
            onClick={button.onClick}
            className={clsx(
              'bg-blueGray-700',
              'active:bg-blueGray-600',
              'text-white',
              'font-bold',
              'uppercase',
              'text-xs',
              'px-4',
              'py-2',
              'rounded',
              'shadow',
              'hover:shadow-md',
              'outline-none',
              'focus:outline-none',
              'mr-1',
              'ease-linear',
              'transition-all',
              'duration-150'
            )}
            type="button"
          >
            {button.title}
          </button>
        )}
      </div>
    </div>
  )
}

export default CardHeading

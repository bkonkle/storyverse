import {ReactNode, MouseEventHandler} from 'react'
import clsx from 'clsx'

export interface FormCardProps {
  children?: ReactNode
  title: string
  button?: {
    title: string
    onClick: MouseEventHandler<HTMLButtonElement>
  }
}

export const FormCard = ({title, button, children}: FormCardProps) => {
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
        'rounded-lg',
        'bg-blueGray-100',
        'border-0'
      )}
    >
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
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>{children}</form>
      </div>
    </div>
  )
}

export default FormCard

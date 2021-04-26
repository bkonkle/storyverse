import {ReactNode, FormEventHandler, MouseEventHandler} from 'react'
import clsx from 'clsx'
import Button from '../buttons/Button'

export interface FormCardProps {
  title: string
  onSubmit?: FormEventHandler<HTMLFormElement>
  button?: {
    title: string
    onClick: MouseEventHandler<HTMLButtonElement>
  }
  children?: ReactNode
}

export const FormCard = ({
  title,
  onSubmit,
  button,
  children,
}: FormCardProps) => {
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
          {button && <Button onClick={button.onClick}>{button.title}</Button>}
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={onSubmit}>{children}</form>
      </div>
    </div>
  )
}

export default FormCard

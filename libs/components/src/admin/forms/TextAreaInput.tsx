import clsx from 'clsx'
import {DetailedHTMLProps, forwardRef, TextareaHTMLAttributes} from 'react'

export interface TextAreaInputProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string
}

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(({name, label, rows = 4, className, ...rest}: TextAreaInputProps, ref) => {
  return (
    <div className="relative w-full mb-3">
      <label
        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
        htmlFor="grid-password"
      >
        {label}
      </label>
      <textarea
        name={name}
        {...rest}
        className={clsx(
          'border-0',
          'px-3',
          'py-3',
          'placeholder-blueGray-300',
          'text-blueGray-600',
          'bg-white',
          'rounded',
          'text-sm',
          'shadow',
          'focus:outline-none',
          'focus:ring',
          'w-full',
          'ease-linear',
          'transition-all',
          'duration-150',
          className
        )}
        rows={rows}
        ref={ref}
      ></textarea>
    </div>
  )
})

export default TextAreaInput

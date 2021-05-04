import clsx from 'clsx'
import {DetailedHTMLProps, forwardRef, InputHTMLAttributes} from 'react'

export interface TextInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string
  error?: string
  hint?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({name, label, className, error, hint, ...rest}: TextInputProps, ref) => {
    return (
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor={name}
        >
          {label}
        </label>
        <input
          type="text"
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
          ref={ref}
        />
        {hint && <div className="text-gray-400 text-xs my-2">{hint}</div>}
        {error && (
          <div className="block text-red-600 text-sm my-2">{error}</div>
        )}
      </div>
    )
  }
)

export default TextInput

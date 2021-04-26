import clsx from 'clsx'
import {forwardRef} from 'react'

export interface TextInputProps {
  name: string
  label: string
  defaultValue?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({name, label, defaultValue}: TextInputProps, ref) => {
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
            'duration-150'
          )}
          defaultValue={defaultValue}
          ref={ref}
        />
      </div>
    )
  }
)

export default TextInput

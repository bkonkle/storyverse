import {forwardRef} from 'react'

export interface TextAreaInputProps {
  name: string
  label: string
  rows?: number
  defaultValue?: string
}

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(({name, label, rows = 4, defaultValue}: TextAreaInputProps, ref) => {
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
        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
        rows={rows}
        defaultValue={defaultValue}
        ref={ref}
      ></textarea>
    </div>
  )
})

export default TextAreaInput

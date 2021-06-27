import {ulid} from 'ulid'
import {useMemo, useState, useEffect} from 'react'
import type Quill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import {Input} from './Forms'

export type EditorValue = Quill.Value
export type EditorSelection = Quill.Range

export interface TextEditorInputProps
  extends Omit<Quill.ReactQuillProps, 'onChange'> {
  readOnly?: boolean
  label: string
  error?: string
  hint?: string
  onChange: (value: EditorValue) => void
}

export interface EditorState {
  value?: EditorValue
  selection?: EditorSelection
}

export default function TextEditorInput({
  value,
  onChange,
  readOnly,
  label,
  error,
  hint,
  ...rest
}: TextEditorInputProps) {
  const id = useMemo(() => ulid(), [])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<EditorState>({value})

  useEffect(() => {
    setLoading(false)
  }, [setLoading])

  if (loading) {
    // Skip the server-side render
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ReactQuill: typeof Quill = require('react-quill')

  return (
    <Input id={id} label={label} error={error} hint={hint}>
      <ReactQuill
        theme="snow"
        className="bg-white"
        value={state.value}
        readOnly={readOnly}
        onChange={(_html, _delta, _source, editor) => {
          const value = editor.getContents()

          setState((state) => ({...state, value}))
          onChange(value)
        }}
        onChangeSelection={(range, _source) => {
          setState((state) => ({...state, selection: range}))
        }}
        {...rest}
      />
    </Input>
  )
}

import {ulid} from 'ulid'
import {useMemo, useState} from 'react'
import ReactQuill, {Value} from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import {Input} from './Forms'

export interface TextEditorInputProps
  extends Omit<ReactQuill.ReactQuillProps, 'onChange'> {
  readOnly?: boolean
  label: string
  error?: string
  hint?: string
  onChange: (value: string) => void
}

export interface EditorState {
  value?: Value
  selection?: ReactQuill.Range
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
  const [state, setState] = useState<EditorState>({value})

  return (
    <Input id={id} label={label} error={error} hint={hint}>
      <ReactQuill
        theme="snow"
        value={state.value}
        readOnly={readOnly}
        onChange={(newValue, _delta, _source, editor) => {
          setState({value: editor.getContents()})
          onChange(newValue)
        }}
        onChangeSelection={(range, _source) => {
          setState({selection: range})
        }}
        {...rest}
      />
    </Input>
  )
}

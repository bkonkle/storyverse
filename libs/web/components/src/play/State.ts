import {ReactNode} from 'react'

/**
 * State
 */

export interface State {
  blink: boolean
  command: string
  output: ReactNode[]
}

export const initialState: State = {
  blink: false,
  command: '',
  output: [],
}

/**
 * Actions
 */

export interface Clear {
  type: 'clear'
}

export interface Key {
  type: 'key'
  key: string
}

export interface Ignore {
  type: 'ignore'
}

export interface Blink {
  type: 'blink'
}

export interface Output {
  type: 'output'
  output: ReactNode[]
}

export type Action = Clear | Key | Ignore | Blink | Output

export const toAction = (event: KeyboardEvent): Action => {
  const {key, altKey, ctrlKey} = event

  if (altKey || ctrlKey) {
    return {type: 'ignore'}
  }

  switch (key) {
    case 'Enter':
      return {type: 'clear'}
    case 'Control':
    case 'Alt':
    case 'Shift':
    case 'Backspace':
    case 'Tab':
    case 'PageDown':
    case 'PageUp':
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'AltGraph':
    case 'CapsLock':
      return {type: 'ignore'}
    default:
      return {type: 'key', key}
  }
}

/**
 * Handler
 */

export type Handler = (state: State, action: Action) => State

/**
 * Update state based on the latest action. Will throw an type error about `undefined` when the
 * switch dosen't exhaustively handle all possible cases.
 */
export const handleAction: Handler = (state, action) => {
  switch (action.type) {
    case 'clear':
      return {...state, command: ''}
    case 'key':
      return {...state, command: `${state.command}${action.key}`}
    case 'blink':
      return {...state, blink: !state.blink}
    case 'ignore':
      return state
    case 'output':
      return {...state, output: [...state.output, ...action.output]}
  }
}

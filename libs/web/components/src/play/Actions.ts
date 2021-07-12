/**
 * State
 */

export interface State {
  blink: boolean
  command: string
}

export const initialState: State = {
  blink: false,
  command: '',
}

/**
 * Actions
 */

export interface Clear {
  type: 'clear'
}

export interface Set {
  type: 'set'
  key: string
}

export interface Ignore {
  type: 'ignore'
}

export interface Blink {
  type: 'blink'
}

export type Action = Clear | Set | Ignore | Blink

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
      return {type: 'set', key}
  }
}

/**
 * Handler
 */

export type Handler = (state: State, action: Action) => State

export const handleAction: Handler = (state, action) => {
  switch (action.type) {
    case 'clear':
      return {...state, command: ''}
    case 'set':
      return {...state, command: `${state.command}${action.key}`}
    case 'blink':
      return {...state, blink: !state.blink}
    case 'ignore':
    default:
      return state
  }
}

import {ReactNode} from 'react'
import {Text} from 'react-native'
import create, {GetState, SetState, State as ZustandState} from 'zustand'

import {Colors} from './Styles'

export interface State extends ZustandState {
  init: () => number[]

  blink: {
    hide: boolean
    toggle: () => void
  }

  command: {
    interacted: boolean
    buffer: string
    append: (key: string) => void
    pop: () => void
    key: (event: KeyboardEvent) => void
    clear: () => void
    send: () => void
  }

  output: {
    value: ReactNode[]
    append: (output: ReactNode[]) => void
  }
}

export async function handleCommand(
  _set: SetState<State>,
  _get: GetState<State>,
  command: string
) {
  console.log(`>- command ->`, command)
}

export const handleKey =
  (get: GetState<State>) =>
  async (event: KeyboardEvent): Promise<void> => {
    const {key, altKey, ctrlKey} = event

    // TODO: Ignore for now, but implement later
    if (altKey || ctrlKey) {
      return
    }

    const {
      command: {send, pop, append},
    } = get()

    switch (key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
      case 'Tab':
      case 'PageDown':
      case 'PageUp':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'AltGraph':
      case 'CapsLock':
      case 'AudioVolumeUp':
      case 'AudioVolumeDown':
        return // ignore
      case 'Enter':
        return send()
      case 'Backspace':
        return pop()
      default:
        return append(key)
    }
  }

export const welcome = (set: SetState<State>) => [
  setTimeout(
    () =>
      set(({output: {append}}) =>
        append([
          <>
            Welcome to <Text style={{color: Colors.tertiary}}>Storyverse</Text>!
          </>,
        ])
      ),
    1000
  ),

  setTimeout(
    () =>
      set(({command: {interacted}, output: {append}}) => {
        if (!interacted) {
          append([
            <>
              If you need help, enter "
              <Text style={{color: Colors.secondary}}>help</Text>" below.
            </>,
          ])
        }
      }),
    5000
  ),
]

export const useStore = create<State>((set, get) => ({
  init: () => [...welcome(set)],

  blink: {
    hide: false,

    toggle: () =>
      set(
        (state): State => ({
          ...state,
          blink: {...state.blink, hide: !state.blink.hide},
        })
      ),
  },

  command: {
    interacted: false,
    buffer: '',
    append: (key: string) =>
      set(
        (state): State => ({
          ...state,
          command: {
            ...state.command,
            buffer: `${state.command.buffer}${key}`,
            interacted: true,
          },
        })
      ),
    pop: () =>
      set(
        (state): State => ({
          ...state,
          command: {
            ...state.command,
            buffer: state.command.buffer.slice(0, -1),
          },
        })
      ),

    key: handleKey(get),

    clear: () =>
      set(
        (state): State => ({
          ...state,
          command: {...state.command, buffer: ''},
        })
      ),

    send: async () => {
      const {
        command: {buffer, clear},
      } = get()

      clear()

      await handleCommand(set, get, buffer)
    },
  },

  output: {
    value: [],

    append: (output: ReactNode[]) =>
      set(
        (state): State => ({
          ...state,
          output: {...state.output, value: [...state.output.value, ...output]},
        })
      ),
  },
}))

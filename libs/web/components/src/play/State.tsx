import {ReactNode} from 'react'
import create, {State as ZustandState} from 'zustand'

import {createSocket, sendCommand} from './Events'
import {handleKey, welcome} from './Interface'

export interface State extends ZustandState {
  init: () => number[]
  destroy: () => void

  socket?: WebSocket
  setSocket: (ws: WebSocket) => void

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

export const useStore = create<State>((set, get) => ({
  init: () => {
    createSocket(get)

    return welcome(get)
  },
  destroy: () => {
    const {socket} = get()
    socket?.close()

    set((state) => ({...state, socket: undefined}))
  },

  socket: undefined,
  setSocket: (ws) => set((state) => ({...state, socket: ws})),

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

      await sendCommand(get, buffer)
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

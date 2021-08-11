import {ReactNode} from 'react'
import create from 'zustand'
import produce from 'immer'

import {createSocket, sendCommand} from './Events'
import {handleKey, welcome} from './Interface'

export interface State {
  init: () => NodeJS.Timeout[]
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
    history: string[]
    stash: string
    searchIndex: number
    append: (key: string) => void
    pop: () => void
    key: (event: KeyboardEvent) => void
    clear: () => void
    send: () => void
    search: (options?: {down?: boolean}) => void
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

    set(
      produce((state: State) => {
        state.socket = undefined
      })
    )
  },

  socket: undefined,
  setSocket: (ws) =>
    set(
      produce((state: State) => {
        state.socket = ws
      })
    ),

  blink: {
    hide: false,

    toggle: () =>
      set(
        produce(({blink}: State) => {
          blink.hide = !blink.hide
        })
      ),
  },

  command: {
    interacted: false,
    buffer: '',
    history: [],
    stash: '',
    searchIndex: 0,

    append: (key: string) =>
      set(
        produce(({command}: State) => {
          command.buffer = `${command.buffer}${key}`
          command.interacted = true
        })
      ),

    pop: () =>
      set(
        produce(({command}: State) => {
          command.buffer = command.buffer.slice(0, -1)
        })
      ),

    key: handleKey(get),

    clear: () =>
      set(
        produce(({command}: State) => {
          command.buffer = ''
        })
      ),

    send: async () => {
      const {
        command: {buffer},
      } = get()

      set(
        produce(({command}: State) => {
          command.buffer = ''
          command.history.unshift(buffer)
          command.searchIndex = 0
        })
      )

      await sendCommand(get, buffer)
    },

    search: async ({down} = {}) => {
      const {
        command: {buffer, stash, history, searchIndex},
      } = get()

      const initiate = !down && searchIndex === 0

      if (initiate) {
        set(
          produce(({command}: State) => {
            command.stash = buffer
          })
        )
      }

      const matches = (initiate ? buffer : stash)
        ? history.filter((command) => command.startsWith(stash || buffer))
        : history

      if (down) {
        if (searchIndex <= 1) {
          set(
            produce(({command}: State) => {
              command.buffer = stash
              command.stash = ''
              command.searchIndex = 0
            })
          )

          return
        }

        set(
          produce(({command}: State) => {
            command.searchIndex = searchIndex - 1
            command.buffer = matches[searchIndex - 2]
          })
        )

        return
      }

      if (searchIndex >= matches.length) {
        return
      }

      set(
        produce(({command}: State) => {
          command.buffer = matches[searchIndex]
          command.searchIndex = searchIndex + 1
        })
      )
    },
  },

  output: {
    value: [],

    append: (lines: ReactNode[]) =>
      set(
        produce(({output}: State) => {
          output.value = output.value.concat(lines)
        })
      ),
  },
}))

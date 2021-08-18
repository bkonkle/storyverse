import create, {StoreApi} from 'zustand/vanilla'
import produce from 'immer'
import WebSocket from 'ws'

export interface State {
  socket: WebSocket

  story: {
    id?: string
    setId: (id: string) => void
  }
}

export type Store = StoreApi<State>

export const createStore = (ws: WebSocket): Store =>
  create<State>((set) => ({
    socket: ws,

    story: {
      id: undefined,
      setId: (id) =>
        set(
          produce(({story}: State) => {
            story.id = id
          })
        ),
    },
  }))

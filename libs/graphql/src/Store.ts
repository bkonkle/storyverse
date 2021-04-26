import create, {State as ZustandState} from 'zustand'

/**
 * This isn't actually needed yet - the router already maintains the state we need to figure out
 * what page we're on.  It's here to demonstrate how to wire in state when it /is/ needed.
 */

export enum Pages {
  Home,
}

export interface State extends ZustandState {
  pages: {
    page: Pages | null
    setPage: (page: Pages | null) => void
  }
}

export const useStore = create<State>((set) => ({
  pages: {
    page: null,
    setPage: (page) => set(({pages}) => ({pages: {...pages, page}})),
  },
}))

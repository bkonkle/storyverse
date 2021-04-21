import create, {State as ZustandState} from 'zustand'

export enum Pages {
  Home,
  Stories,
  Series,
  Universes,
  User,
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

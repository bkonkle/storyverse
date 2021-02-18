import create, {State as ZustandState} from 'zustand'

export type User = Record<string, unknown>

export enum Pages {
  Home,
  Stories,
  Series,
  Universes,
}

export interface State extends ZustandState {
  users: {
    user: User | null
    loading: boolean
    setLoading: (state?: boolean) => void
    setUser: (user: User) => void
  }
  pages: {
    page: Pages | null
    setPage: (page: Pages | null) => void
  }
}

export const useStore = create<State>((set) => ({
  users: {
    user: null,
    loading: false,
    setLoading: (loading = true) =>
      set(({users}) => ({users: {...users, loading}})),
    setUser: (user) =>
      set(({users}) => ({
        users: {...users, user, loading: false},
      })),
  },
  pages: {
    page: null,
    setPage: (page) => set(({pages}) => ({pages: {...pages, page}})),
  },
}))

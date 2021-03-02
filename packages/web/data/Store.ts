import create, {State as ZustandState} from 'zustand'

export interface User {
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
}

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
    setLoading: (state: boolean) => void
    setUser: (user: User | null) => void
  }
  pages: {
    page: Pages | null
    setPage: (page: Pages | null) => void
  }
}

export const useStore = create<State>((set) => ({
  users: {
    user: null,
    loading: true,
    setLoading: (loading) => set(({users}) => ({users: {...users, loading}})),
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

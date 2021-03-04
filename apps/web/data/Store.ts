import create, {State as ZustandState} from 'zustand'

import * as AuthClient from './AuthClient'

export type AuthUser = AuthClient.User

export enum Pages {
  Home,
  Stories,
  Series,
  Universes,
}

export interface State extends ZustandState {
  auth: {
    user: AuthUser | null
    loading: boolean
    setLoading: (state: boolean) => void
    setUser: (user: AuthUser | null) => void
  }
  pages: {
    page: Pages | null
    setPage: (page: Pages | null) => void
  }
}

export const useStore = create<State>((set) => ({
  auth: {
    user: null,
    loading: true,
    setLoading: (loading) => set(({auth}) => ({auth: {...auth, loading}})),
    setUser: (user) =>
      set(({auth}) => ({
        auth: {...auth, user, loading: false},
      })),
  },
  pages: {
    page: null,
    setPage: (page) => set(({pages}) => ({pages: {...pages, page}})),
  },
}))

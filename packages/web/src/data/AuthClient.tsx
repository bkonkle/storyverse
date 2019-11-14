import React, {FC, createContext, useState, useEffect, useContext} from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client'

export interface AuthUser {}

interface Props extends Auth0ClientOptions {
  onRedirectCallback?<S>(appState: S): void
}

interface Auth0Context {
  isAuthenticated: boolean
  user?: AuthUser
  loading: boolean
  popupOpen: boolean
  loginWithPopup: (params?: {}) => Promise<void>
  handleRedirectCallback: () => Promise<void>
  getIdTokenClaims: Auth0Client['getIdTokenClaims']
  loginWithRedirect: Auth0Client['loginWithRedirect']
  getTokenSilently: Auth0Client['getTokenSilently']
  getTokenWithPopup: Auth0Client['getTokenWithPopup']
  logout: Auth0Client['logout']
}

const DEFAULT_REDIRECT_CALLBACK = (appState: {targetUrl?: string}) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
}

export const Auth0Context = createContext<Auth0Context>({
  isAuthenticated: false,
  user: undefined,
  loading: false,
  popupOpen: false,
} as Auth0Context)
export const useAuth0 = () => useContext(Auth0Context)

export const Auth0Provider: FC<Props> = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState()
  const [auth0Client, setAuth0] = useState<Auth0Client>()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (window.location.search.includes('code=')) {
        const {appState} = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated()

      setIsAuthenticated(isAuthenticated)

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser()
        setUser(user)
      }

      setLoading(false)
    }
    initAuth0()
  }, [])

  if (!auth0Client) {
    return null
  }

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true)
    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error)
    } finally {
      setPopupOpen(false)
    }
    const user = await auth0Client.getUser()
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setLoading(true)
    await auth0Client.handleRedirectCallback()
    const user = await auth0Client.getUser()
    setLoading(false)
    setIsAuthenticated(true)
    setUser(user)
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: auth0Client.getIdTokenClaims.bind(auth0Client),
        loginWithRedirect: auth0Client.loginWithRedirect.bind(auth0Client),
        getTokenSilently: auth0Client.getTokenSilently.bind(auth0Client),
        getTokenWithPopup: auth0Client.getTokenWithPopup.bind(auth0Client),
        logout: auth0Client.logout.bind(auth0Client),
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
}

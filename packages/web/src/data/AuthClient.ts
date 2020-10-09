import auth0 from 'auth0-js'
import {navigate} from 'gatsby'

interface AuthTokens {
  accessToken?: string
  idToken?: string
  expiresAt?: number
}

enum Keys {
  isAuthenticated = 'storyverse:isAuthenticated',
}

const isBrowser = typeof window !== 'undefined'
const clientID = process.env.GATSBY_AUTH0_CLIENT_ID
const domain = process.env.GATSBY_AUTH0_DOMAIN

const auth: auth0.WebAuth | undefined =
  isBrowser && clientID && domain
    ? new auth0.WebAuth({
        clientID,
        domain,
        audience: process.env.GATSBY_AUTH0_AUDIENCE,
        redirectUri: window.location.origin,
        responseType: 'token id_token',
        scope: 'openid profile email',
      })
    : undefined

export const tokens: AuthTokens = {
  accessToken: undefined,
  idToken: undefined,
  expiresAt: undefined,
}

export let user: auth0.Auth0UserProfile | undefined

export const isAuthenticated = () =>
  localStorage.getItem(Keys.isAuthenticated) === 'true'

export const setIsAuthenticated = (value: boolean) => {
  if (value) {
    localStorage.setItem(Keys.isAuthenticated, 'true')
  } else {
    localStorage.removeItem(Keys.isAuthenticated)
  }
}

export const login = () => {
  if (!auth) {
    return
  }

  auth.authorize()
}

const setSession = (cb = () => {}) => (
  err: auth0.Auth0Error | null,
  authResult: auth0.Auth0DecodedHash | null
) => {
  if (err) {
    setIsAuthenticated(false)
    navigate('/')
    cb()
    return
  }

  if (authResult?.accessToken && authResult.idToken) {
    let expiresAt = (authResult.expiresIn || 0) * 1000 + new Date().getTime()
    tokens.accessToken = authResult.accessToken
    tokens.idToken = authResult.idToken
    tokens.expiresAt = expiresAt
    user = authResult.idTokenPayload

    setIsAuthenticated(true)
    cb()
  }
}

export const silentAuth = (callback: () => void) => {
  if (!auth || !isAuthenticated()) {
    return callback()
  }

  auth.checkSession({}, setSession(callback))
}

export const handleAuthentication = () => {
  if (!auth) {
    return
  }

  auth.parseHash(
    setSession(() => {
      navigate('/app')
    })
  )
}

export const logout = () => {
  if (!auth) {
    return
  }

  setIsAuthenticated(false)
  auth.logout({returnTo: window.location.origin})
}

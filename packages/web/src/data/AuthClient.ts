import Auth0Lock from 'auth0-lock'

export interface Jwt {
  name: string
}

const KEY_PREFIX = 'storyverse'
export const ACCESS_TOKEN_KEY = `${KEY_PREFIX}:access-token`
export const PROFILE_KEY = `${KEY_PREFIX}:profile`

export const lock = new Auth0Lock(
  process.env.GATSBY_AUTH0_CLIENT_ID || '',
  process.env.GATSBY_AUTH0_DOMAIN || ''
)

export function login() {
  return new Promise((resolve, reject) => {
    lock.on('authenticated', authResult => {
      lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          reject(error)

          return
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, authResult.accessToken)
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))

        resolve(profile)
      })
    })

    lock.show()
  })
}

export async function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(PROFILE_KEY)
}

export async function getAccessToken() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || undefined
  const profile = localStorage.getItem(PROFILE_KEY) || undefined

  return {accessToken, profile: profile && JSON.parse(profile)}
}

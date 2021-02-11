import {initAuth0} from '@auth0/nextjs-auth0'

let auth0: ReturnType<typeof initAuth0>

export const init = () => {
  if (!auth0) {
    const {
      BASE_URL,
      OAUTH2_DOMAIN = 'storyverse.auth0.com',
      OAUTH2_CLIENT_ID,
      OAUTH2_CLIENT_SECRET,
      OAUTH2_COOKIE_SECRET,
    } = process.env

    if (!BASE_URL) {
      throw new Error('BASE_URL not found')
    }

    if (!OAUTH2_CLIENT_ID || !OAUTH2_CLIENT_SECRET || !OAUTH2_COOKIE_SECRET) {
      throw new Error('OAuth2 configuration not found')
    }

    const redirectUri = `${BASE_URL}/api/login/callback`
    const postLogoutRedirectUri = `${BASE_URL}/`

    auth0 = initAuth0({
      domain: OAUTH2_DOMAIN,
      clientId: OAUTH2_CLIENT_ID,
      clientSecret: OAUTH2_CLIENT_SECRET,
      scope: 'openid profile',
      redirectUri,
      postLogoutRedirectUri,
      session: {
        cookieSecret: OAUTH2_COOKIE_SECRET,
        cookieLifetime: 60 * 60 * 8,
        storeIdToken: false,
        storeAccessToken: false,
        storeRefreshToken: false,
      },
      oidcClient: {
        httpTimeout: 2500,
        clockTolerance: 10000,
      },
    })
  }

  return auth0
}

export default {init}

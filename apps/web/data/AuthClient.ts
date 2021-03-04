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

    auth0 = initAuth0({
      baseURL: BASE_URL,
      issuerBaseURL: `https://${OAUTH2_DOMAIN}`,
      clientID: OAUTH2_CLIENT_ID,
      clientSecret: OAUTH2_CLIENT_SECRET,
      secret: OAUTH2_COOKIE_SECRET,
      authorizationParams: {
        scope: 'openid profile email',
      },
      routes: {
        callback: '/api/login/callback',
        postLogoutRedirect: '/',
      },
      session: {
        rollingDuration: 60 * 60 * 24,
        absoluteDuration: 60 * 60 * 24 * 7,
      },
    })
  }

  return auth0
}

export default {init}

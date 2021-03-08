import axios from 'axios'

export interface Credentials {
  token?: string
  username?: string
  email?: string
}

const credentials: Credentials = {}
const altCredentials: Credentials = {}

export const init = (processEnv = process.env) => {
  const {
    OAUTH2_TEST_USER,
    OAUTH2_TEST_PASS,
    OAUTH2_TEST_USER_ALT,
    OAUTH2_TEST_PASS_ALT,
    OAUTH2_DOMAIN,
    OAUTH2_AUDIENCE,
    OAUTH2_CLIENT_ID,
    OAUTH2_CLIENT_SECRET,
  } = processEnv

  beforeAll(async () => {
    if (!credentials.token) {
      const {
        data: {access_token: accessToken},
      } = await axios.post(`https://${OAUTH2_DOMAIN}/oauth/token`, {
        grant_type: 'password',
        username: OAUTH2_TEST_USER,
        password: OAUTH2_TEST_PASS,
        client_id: OAUTH2_CLIENT_ID,
        client_secret: OAUTH2_CLIENT_SECRET,
        scope: 'openid profile email',
        audience: OAUTH2_AUDIENCE,
      })
      credentials.token = accessToken
    }

    if (!credentials.username || !credentials.email) {
      const {
        data: {sub, email},
      } = await axios.get(`https://${OAUTH2_DOMAIN}/userinfo`, {
        headers: {Authorization: `Bearer ${credentials.token}`},
      })
      credentials.username = sub
      credentials.email = email
    }

    if (!altCredentials.token) {
      const {
        data: {access_token: altAccessToken},
      } = await axios.post(`https://${OAUTH2_DOMAIN}/oauth/token`, {
        grant_type: 'password',
        username: OAUTH2_TEST_USER_ALT,
        password: OAUTH2_TEST_PASS_ALT,
        client_id: OAUTH2_CLIENT_ID,
        client_secret: OAUTH2_CLIENT_SECRET,
        scope: 'openid profile email',
        audience: OAUTH2_AUDIENCE,
      })
      altCredentials.token = altAccessToken
    }

    if (!altCredentials.username || !altCredentials.email) {
      const {
        data: {sub: altSub, email: altEmail},
      } = await axios.get(`https://${OAUTH2_DOMAIN}/userinfo`, {
        headers: {Authorization: `Bearer ${altCredentials.token}`},
      })
      altCredentials.username = altSub
      altCredentials.email = altEmail
    }
  })

  return {
    credentials,
    altCredentials,
  }
}

export default {init}

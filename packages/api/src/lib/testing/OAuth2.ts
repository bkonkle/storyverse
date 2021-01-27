import axios from 'axios'

export interface Credentials {
  token?: string
  username?: string
}

const credentials: Credentials = {}
const altCredentials: Credentials = {}

export const init = (processEnv = process.env) => {
  const {
    OAUTH2_TEST_USER,
    OAUTH2_TEST_PASS,
    OAUTH2_TEST_USER_ALT,
    OAUTH2_TEST_PASS_ALT,
    OAUTH2_ISSUER,
    OAUTH2_AUDIENCE,
    OAUTH2_CLIENT_ID,
    OAUTH2_CLIENT_SECRET,
  } = processEnv

  beforeAll(async () => {
    if (!credentials.token) {
      const {
        data: {access_token: accessToken},
      } = await axios.post(`${OAUTH2_ISSUER}oauth/token`, {
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

    if (!credentials.username) {
      const {
        data: {sub},
      } = await axios.get(`${OAUTH2_ISSUER}userinfo`, {
        headers: {Authorization: `Bearer ${credentials.token}`},
      })
      credentials.username = sub
    }

    if (!altCredentials.token) {
      const {
        data: {access_token: altAccessToken},
      } = await axios.post(`${OAUTH2_ISSUER}oauth/token`, {
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

    if (!altCredentials.username) {
      const {
        data: {sub: altSub},
      } = await axios.get(`${OAUTH2_ISSUER}userinfo`, {
        headers: {Authorization: `Bearer ${altCredentials.token}`},
      })
      altCredentials.username = altSub
    }
  })

  return {
    credentials,
    altCredentials,
  }
}

export default {init}

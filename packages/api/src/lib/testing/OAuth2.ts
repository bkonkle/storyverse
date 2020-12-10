import axios from 'axios'

let token: string
let username: string

let altToken: string
let altUsername: string

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
    if (!token) {
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
      token = accessToken
    }

    if (!username) {
      const {
        data: {sub},
      } = await axios.get(`${OAUTH2_ISSUER}userinfo`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      username = sub
    }

    if (!altToken) {
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
      altToken = altAccessToken
    }

    if (!altUsername) {
      const {
        data: {sub: altSub},
      } = await axios.get(`${OAUTH2_ISSUER}userinfo`, {
        headers: {Authorization: `Bearer ${altToken}`},
      })
      altUsername = altSub
    }
  })

  return {
    getCredentials: () => ({token, username}),
    getAltCredentials: () => ({token: altToken, username: altUsername}),
  }
}

export default {init}

import axios from 'axios'

export const init = () => {
  let token: string
  let username: string

  const {
    AUTH0_TEST_USER,
    AUTH0_TEST_PASS,
    AUTH0_ISSUER,
    AUTH0_AUDIENCE,
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET,
  } = process.env

  beforeAll(async () => {
    const {
      data: {access_token: accessToken},
    } = await axios.post(`${AUTH0_ISSUER}oauth/token`, {
      grant_type: 'password',
      username: AUTH0_TEST_USER,
      password: AUTH0_TEST_PASS,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      scope: 'openid profile email',
      audience: AUTH0_AUDIENCE,
    })
    token = accessToken

    const {
      data: {sub},
    } = await axios.get(`${AUTH0_ISSUER}userinfo`, {
      headers: {Authorization: `Bearer ${token}`},
    })
    username = sub
  })

  return {
    getToken: () => token,
    getUsername: () => username,
    getCredentials: () => ({token, username}),
  }
}

export default {init}

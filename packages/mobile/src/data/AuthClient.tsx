import * as AuthSession from 'expo-auth-session'
import {Alert, AsyncStorage} from 'react-native'

import Config from '../Config'

export interface Jwt {
  name: string
}

export const KEY_PREFIX = 'storyverse'
export const ACCESS_TOKEN_KEY = `${KEY_PREFIX}:access-token`
export const TOKEN_TYPE_KEY = `${KEY_PREFIX}:token-type`
export const EXPIRES_AT_KEY = `${KEY_PREFIX}:expires-at`

function toQueryString(params: {[key: string]: string}) {
  const queryString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&')

  return `?${queryString}`
}

function now() {
  return new Date().getTime()
}

export async function login(options?: {connection: string}) {
  const connection = options && options.connection

  const redirectUrl = AuthSession.getRedirectUrl()

  if (!Config.Auth.clientId) {
    Alert.alert('Error', 'No authentication client ID found')

    return false
  }

  const result = await AuthSession.startAsync({
    authUrl: `${Config.Auth.domain}/authorize${toQueryString({
      ...(connection ? {connection} : {}),
      client_id: Config.Auth.clientId,
      response_type: 'token',
      scope: 'openid email',
      audience: Config.Auth.audience,
      redirect_uri: redirectUrl,
    })}`,
  })

  if (result.type === 'success') {
    const {params} = result

    if (params.error) {
      Alert.alert(
        'Error',
        params.error_description || 'something went wrong while logging in'
      )

      return false
    }

    const {access_token, token_type, expires_in} = params

    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, access_token)
    await AsyncStorage.setItem(TOKEN_TYPE_KEY, token_type)
    await AsyncStorage.setItem(
      EXPIRES_AT_KEY,
      (now() + Number(expires_in) * 1000).toString()
    )
  }

  return true
}

export async function logout() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
  await AsyncStorage.removeItem(TOKEN_TYPE_KEY)
  await AsyncStorage.removeItem(EXPIRES_AT_KEY)
}

export async function getAccessToken() {
  const expiresAt = await AsyncStorage.getItem(EXPIRES_AT_KEY)

  if (Number(expiresAt) > new Date().getTime()) {
    const accessToken =
      (await AsyncStorage.getItem(ACCESS_TOKEN_KEY)) || undefined
    const tokenType = (await AsyncStorage.getItem(TOKEN_TYPE_KEY)) || undefined

    return {accessToken, tokenType}
  }
}

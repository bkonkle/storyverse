import React, {useEffect} from 'react'
import {Button, Icon} from 'react-native-elements'
import {useGetCurrentUserMutation} from '../../Schema'
import {login} from '../../data/AuthClient'

export interface Props {}

const handleLogin = async () => {
  await login()
}

export const NavIcon = (_props: Props) => {
  const [{error, fetching, data}, getCurrentUser] = useGetCurrentUserMutation()

  // Call the getCurrentUser mutation to get or create a user account on mount
  useEffect(() => {
    getCurrentUser({input: {}})
  }, [])

  if (error) {
    console.error(error)
  }

  if (fetching || !data) {
    return null
  }

  return (
    <Button
      title="Login"
      titleStyle={{fontSize: 16, marginRight: '0.5rem'}}
      iconRight
      icon={<Icon name="login" type="material-community" color="white" />}
      onPress={handleLogin}
    />
  )
}

export default NavIcon

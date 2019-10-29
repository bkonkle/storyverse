import React, {useEffect} from 'react'
import {Button, Icon} from 'react-native-elements'
import {useGetCurrentUserMutation} from '../../Schema'

export interface Props {}

export const NavIcon = (_props: Props) => {
  const [{error, fetching, data}, getCurrentUser] = useGetCurrentUserMutation()

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
    />
  )
}

export default NavIcon

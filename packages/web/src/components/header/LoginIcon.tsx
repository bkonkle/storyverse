import React from 'react'
import {Button, Icon} from 'react-native-elements'
import {NavigationInjectedProps, withNavigation} from 'react-navigation'

export interface Props extends NavigationInjectedProps<{}> {}

export const NavIcon = (_props: Props) => {
  return (
    <Button
      title="Login"
      titleStyle={{fontSize: 16, marginRight: '0.5rem'}}
      iconRight
      icon={<Icon name="login" type="material-community" color="white" />}
    />
  )
}

export default withNavigation(NavIcon)

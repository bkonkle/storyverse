import React from 'react'
import {Icon} from 'react-native-elements'
import {NavigationInjectedProps, withNavigation} from 'react-navigation'

export interface Props extends NavigationInjectedProps<{}> {}

export const NavIcon = (props: Props) => {
  const handleNav = () => {
    props.navigation.toggleDrawer()
  }

  return <Icon name="menu" color="white" onPress={handleNav} />
}

export default withNavigation(NavIcon)

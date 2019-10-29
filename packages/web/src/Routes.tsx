import React from 'react'
import {Icon} from 'react-native-elements'
import {createAppContainer, createDrawerNavigator} from 'react-navigation'

import Dashboard from './components/screens/user/Dashboard'

const AppNavigator = createDrawerNavigator({
  Home: {
    screen: Dashboard,
    navigationOptions: {
      title: 'Home',
      drawerIcon: () => <Icon name="home" />,
    },
  },
})

export default createAppContainer(AppNavigator)

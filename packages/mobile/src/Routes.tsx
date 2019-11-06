import React from 'react'
import {Icon} from 'react-native-elements'
import {createAppContainer, createDrawerNavigator} from 'react-navigation'
import Constants from 'expo-constants'

import Dashboard from './components/screens/user/Dashboard'

const AppNavigator = createDrawerNavigator(
  {
    Home: {
      screen: Dashboard,
      navigationOptions: {
        title: 'Home',
        drawerIcon: () => <Icon name="home" />,
      },
    },
  },
  {
    // @ts-ignore - error in library types
    useNativeAnimations: Constants.platform.web ? false : true,
  }
)

export default createAppContainer(AppNavigator)

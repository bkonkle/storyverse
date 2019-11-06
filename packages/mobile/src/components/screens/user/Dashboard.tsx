import React from 'react'
import {Header} from 'react-native-elements'

import NavIcon from '../../header/NavIcon'
import LoginIcon from '../../header/LoginIcon'

interface Props {}

export const LoginScreen = (_props: Props) => {
  return (
    <>
      <Header
        leftComponent={<NavIcon />}
        centerComponent={{text: 'Storyverse', style: {color: 'white'}}}
        rightComponent={<LoginIcon />}
      />
    </>
  )
}

export default LoginScreen

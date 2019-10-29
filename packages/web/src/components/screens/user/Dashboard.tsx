import React, {Component} from 'react'
import {Header} from 'react-native-elements'

import NavIcon from '../../header/NavIcon'

interface Props {}

export default class LoginScreen extends Component<Props> {
  render() {
    return (
      <>
        <Header
          leftComponent={<NavIcon />}
          centerComponent={{text: 'Storyverse', style: {color: 'white'}}}
          rightComponent={{icon: 'home', color: 'white'}}
        />
      </>
    )
  }
}

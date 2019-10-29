import React, {Component} from 'react'
import {Icon} from 'react-native-elements'
import {NavigationInjectedProps, withNavigation} from 'react-navigation'

export interface Props extends NavigationInjectedProps<{}> {}

export class NavIcon extends Component<Props> {
  render() {
    return <Icon name="menu" color="white" onPress={this.handleNav} />
  }

  private handleNav = () => {
    this.props.navigation.toggleDrawer()
  }
}

export default withNavigation(NavIcon)

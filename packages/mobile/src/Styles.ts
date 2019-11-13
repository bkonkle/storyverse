import {ImageStyle, TextStyle, ViewStyle} from 'react-native'

type Style = ViewStyle | TextStyle | ImageStyle

export const buttonContainer: Style = {
  margin: '2%',
  justifyContent: 'flex-end',
  flexDirection: 'row',
}

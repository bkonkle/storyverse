import {StyleSheet, Text, View} from 'react-native'
import {useEffect, useState} from 'react'
import {delay, fromEvent, interval, map, merge, of, scan} from 'rxjs'
import {StoryDataFragment} from '@storyverse/graphql/Schema'

import {Action, initialState, toAction, handleAction} from './State'

export interface StoryProps {
  story?: StoryDataFragment
  disabled?: boolean
}

const Colors = {
  bg: '#2b1f32',
} as const

const Styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg, height: '100%', padding: 20},
  font: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#eeeeee',
  },
  prompt: {fontWeight: 'bold', paddingRight: 10},
  cursor: {color: '#0aacc5'},
})

export const Story = (_props: StoryProps) => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const keyboard = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map(toAction)
    )

    const blinker = interval(600).pipe(map((): Action => ({type: 'blink'})))

    const welcome = of<Action>({
      type: 'output',
      output: ['Welcome to Storyverse!', ' '],
    }).pipe(delay(1000))

    const sub = merge(keyboard, blinker, welcome)
      .pipe(scan(handleAction, initialState))
      .subscribe(setState)

    return () => sub.unsubscribe()
  }, [setState])

  const {blink, command, output} = state

  const cursor = blink ? ' ' : '|'

  return (
    <View style={Styles.container}>
      {output.map((row) => (
        <Text style={Styles.font}>{row === '' ? ' ' : row}</Text>
      ))}
      <Text style={Styles.font}>
        <Text style={Styles.prompt}>&gt;</Text>
        <Text>{command}</Text>
        <Text style={Styles.cursor}>{cursor}</Text>
      </Text>
    </View>
  )
}

export default Story

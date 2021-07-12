import {Text, View} from 'react-native'
import {useEffect, useState} from 'react'
import {fromEvent, interval, map, merge, scan} from 'rxjs'
import {StoryDataFragment} from '@storyverse/graphql/Schema'
import {Action, initialState, toAction, handleAction} from './Actions'

export interface PlayStoryProps {
  story?: StoryDataFragment
  disabled?: boolean
}

export const PlayStory = (_props: PlayStoryProps) => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    const keyboard = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      map(toAction)
    )

    const blinker = interval(600).pipe(map((): Action => ({type: 'blink'})))

    const sub = merge(keyboard, blinker)
      .pipe(scan(handleAction, initialState))
      .subscribe(setState)

    return () => sub.unsubscribe()
  }, [setState])

  const {blink, command} = state

  const cursor = blink ? ' ' : '|'

  return (
    <View
      style={{flex: 1, backgroundColor: '#2b1f32', height: '100%', padding: 20}}
    >
      <Text
        style={{
          fontFamily: 'monospace',
          fontSize: 16,
          color: '#eeeeee',
        }}
      >
        <Text style={{fontWeight: 'bold', paddingRight: 10}}>&gt;</Text>
        <Text>{command}</Text>
        <Text style={{color: '#0aacc5'}}>{cursor}</Text>
      </Text>
    </View>
  )
}

export default PlayStory

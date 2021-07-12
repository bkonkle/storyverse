import {Text, View} from 'react-native'
import {useCallback, useEffect, useState} from 'react'
import {fromEvent, map} from 'rxjs'
import {StoryDataFragment} from '@storyverse/graphql/Schema'

export interface PlayStoryProps {
  story?: StoryDataFragment
  disabled?: boolean
}

// export const Action = ['clear', 'set', 'ignore'] as const
// export type Action = typeof Action[number]

namespace Actions {
  export interface Clear {
    type: 'clear'
  }

  export interface Set {
    type: 'set'
    key: string
  }

  export interface Ignore {
    type: 'ignore'
  }

  export type Action = Clear | Set | Ignore
}

const toAction = (event: KeyboardEvent): Actions.Action => {
  const {key, altKey, ctrlKey} = event

  if (altKey || ctrlKey) {
    return {type: 'ignore'}
  }

  switch (key) {
    case 'Enter':
      return {type: 'clear'}
    case 'Control':
    case 'Alt':
    case 'Shift':
    case 'Backspace':
    case 'Tab':
    case 'PageDown':
    case 'PageUp':
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'AltGraph':
    case 'CapsLock':
      return {type: 'ignore'}
    default:
      return {type: 'set', key}
  }
}

export const PlayStory = (_props: PlayStoryProps) => {
  const [blink, setBlink] = useState(false)
  const [command, setCommand] = useState<string>('')

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(!blink)
    }, 600)

    return () => clearInterval(id)
  }, [blink, setBlink])

  useEffect(() => {
    const sub = fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(map(toAction))
      .subscribe((action) => {
        switch (action.type) {
          case 'set':
            return setCommand(`${command}${action.key}`)
          case 'clear':
            return setCommand('')
          case 'ignore':
          default:
          // pass
        }
      })

    return () => sub.unsubscribe()
  }, [command, setCommand])

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

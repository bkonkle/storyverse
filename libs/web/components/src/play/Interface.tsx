import {Text} from 'react-native'
import {GetState} from 'zustand'

import {Colors} from './Styles'
import {State} from './State'

export const handleKey =
  (get: GetState<State>) =>
  async (event: KeyboardEvent): Promise<void> => {
    const {key, altKey, ctrlKey} = event

    // TODO: Ignore for now, but implement later
    if (altKey || ctrlKey) {
      return
    }

    const {
      command: {send, pop, append},
    } = get()

    switch (key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
      case 'Tab':
      case 'PageDown':
      case 'PageUp':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'AltGraph':
      case 'CapsLock':
      case 'AudioVolumeUp':
      case 'AudioVolumeDown':
        return // ignore
      case 'Enter':
        return send()
      case 'Backspace':
        return pop()
      default:
        return append(key)
    }
  }

export const welcome = (get: GetState<State>) => [
  setTimeout(() => {
    const {output} = get()

    output.append([
      <>
        Welcome to <Text style={{color: Colors.tertiary}}>Storyverse</Text>!
      </>,
    ])
  }, 1000),

  setTimeout(() => {
    const {command, output} = get()

    if (!command.interacted) {
      output.append([
        <>
          If you need help, enter "
          <Text style={{color: Colors.secondary}}>help</Text>" below.
        </>,
      ])
    }
  }, 5000),
]

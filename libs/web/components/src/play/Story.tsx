import {StyleSheet, Text, View} from 'react-native'
import {useEffect, useRef} from 'react'
import {StoryDataFragment} from '@storyverse/graphql/Schema'

import {useStore} from './State'
import {Colors} from './Styles'

export interface StoryProps {
  story?: StoryDataFragment
  disabled?: boolean
}

const Styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.bg, height: '100%', padding: 20},
  font: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: Colors.bright,
  },
  prompt: {fontWeight: 'bold', paddingRight: 10},
  cursor: {color: Colors.primary},
})

export const Story = (_props: StoryProps) => {
  const init = useStore((state) => state.init)
  const blink = useStore((state) => state.blink)
  const command = useStore((state) => state.command)
  const output = useStore((state) => state.output)
  const {append} = output

  useEffect(() => {
    let socket: WebSocket | undefined

    const init = () => {
      const ws = new WebSocket(`ws://${document.location.host}/api`)

      ws.addEventListener('open', () => {
        append([
          <>
            <Text style={{color: Colors.secondary}}>Connected</Text> to the
            server...
          </>,
        ])
      })

      ws.addEventListener('message', (event) => {
        console.log(`>- event ->`, JSON.parse(event.data))
      })

      ws.addEventListener('error', () => {
        ws.close()
        setTimeout(() => {
          socket = init()
        }, 1000)
      })

      return ws
    }

    socket = init()

    return () => {
      socket?.close()
    }
  }, [append])

  useEffect(() => {
    document.addEventListener('keydown', command.key)

    const blinker = setInterval(() => {
      blink.toggle()
    }, 600)

    return () => {
      document.removeEventListener('keydown', command.key)

      clearInterval(blinker)
    }
  }, [command.key, blink.toggle]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timeouts = init()

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [init])

  const cursor = blink.hide ? ' ' : '|'

  return (
    <View style={Styles.container}>
      {output.value.map((row, i) => (
        <Text style={Styles.font} key={i}>
          {row === '' ? ' ' : row}
        </Text>
      ))}
      <Text style={Styles.font}>
        <Text style={Styles.prompt}>&gt;</Text>
        <Text>{command.buffer}</Text>
        <Text style={Styles.cursor}>{cursor}</Text>
      </Text>
    </View>
  )
}

export default Story

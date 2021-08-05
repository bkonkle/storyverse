import {Text} from 'react-native'
import {GetState} from 'zustand'
import {Action, Command} from '@storyverse/messaging'

import {State} from './State'
import {Colors} from './Styles'

export const createSocket = (get: GetState<State>) => {
  const ws = new WebSocket(`ws://${document.location.host}/api`)

  ws.addEventListener('open', () => {
    const {
      output: {append},
    } = get()

    append([
      <>
        <Text style={{color: Colors.secondary}}>Connected</Text> to the
        server...
      </>,
    ])
  })

  ws.addEventListener('message', handleMessage(get))

  ws.addEventListener('close', () => {
    setTimeout(() => createSocket(get), 1000)
  })

  ws.addEventListener('error', () => {
    ws.close()
  })

  const {setSocket} = get()

  setSocket(ws)
}

export async function sendCommand(get: GetState<State>, command: string) {
  const {socket, output} = get()

  if (!socket) {
    output.append([
      <Text style={{color: Colors.tertiary}}>
        Sorry, I'm not able to talk to the server right now. Try again later.
      </Text>,
    ])

    return
  }

  const event: Command = {
    type: 'COMMAND',
    command,
  }

  socket.send(JSON.stringify(event))
}

export const handleMessage =
  (get: GetState<State>) => (event: MessageEvent) => {
    const message: Action = JSON.parse(event.data)

    switch (message.type) {
      case 'OUTPUT': {
        const {output} = get()

        output.append([message.output])

        return
      }
      case 'PING': {
        return
      }
      default: {
        console.log(
          `Unexpected message type received: ${message.type}`,
          message
        )

        return
      }
    }
  }

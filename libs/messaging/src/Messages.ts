export const Actions = {
  ping: 'PING',
  command: 'COMMAND',
  output: 'OUTPUT',
  joinStory: 'JOIN_STORY',
  sendMessage: 'SEND_MESSAGE',
  receiveMessage: 'RECEIVE_MESSAGE',
} as const

export interface Ping {
  type: typeof Actions.ping
}

export interface Command {
  type: typeof Actions.command
  command: string
}

export interface Output {
  type: typeof Actions.output
  output: string
}

export interface JoinStory {
  type: typeof Actions.joinStory
  storyId: string
}

export interface SendMessage {
  type: typeof Actions.sendMessage
  storyId: string
  text: string
}

export interface ReceiveMessage {
  type: typeof Actions.receiveMessage
  storyId: string
  text: string
}

export type Action =
  | Ping
  | Command
  | Output
  | JoinStory
  | SendMessage
  | ReceiveMessage

export const format = (action: Action) => JSON.stringify(action)

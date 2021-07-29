export const Actions = {
  ping: 'PING',
  command: 'COMMAND',
  output: 'OUTPUT',
} as const

export interface Ping {
  type: typeof Actions.ping
}

export interface Command {
  type: typeof Actions.command
  command: string
  storyId: string
}

export interface Output {
  type: typeof Actions.output
  output: string
  storyId: string
}

export type Action = Ping | Command | Output

export const format = (action: Action) => JSON.stringify(action)

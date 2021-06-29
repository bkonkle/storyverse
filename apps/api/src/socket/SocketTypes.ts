export enum ActionTypes {
  ping = 'PING',
  messageSend = 'MESSAGE_SEND',
  messageReceive = 'MESSAGE_RECEIVE',
  clientRegister = 'CLIENT_REGISTER',
}

export interface Ping {
  type: ActionTypes.ping
}

export interface MessageSend {
  type: ActionTypes.messageSend
  payload: {
    storyId: string
    profileId: string
    text: string
  }
}

export interface MessageReceive {
  type: ActionTypes.messageReceive
  payload: {
    profileId: string
    text: string
  }
}

export interface ClientRegister {
  type: ActionTypes.clientRegister
  payload: {
    storyId: string
  }
}

export type Action = Ping | MessageSend | MessageReceive | ClientRegister

export namespace Actions {
  export function ping() {
    return {type: ActionTypes.ping}
  }

  export function sendMessage(
    storyId: string,
    profileId: string,
    text: string
  ) {
    return {type: ActionTypes.messageSend, payload: {storyId, profileId, text}}
  }

  export function receiveMessage(profileId: string, text: string) {
    return {type: ActionTypes.messageReceive, payload: {profileId, text}}
  }

  export function registerClient(storyId: string) {
    return {type: ActionTypes.clientRegister, payload: {storyId}}
  }
}

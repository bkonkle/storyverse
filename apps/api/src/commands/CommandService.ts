import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import nlp from 'compromise'
import without from 'lodash/without'
import {Profile} from '@prisma/client'

import {NodeDebug} from '@storyverse/api/utils'
import {Actions, Output} from '@storyverse/messaging'

import {General, selectFrom} from './CommandResponses'

@injectable()
export default class CommandService {
  private readonly debug: Debug.IDebugger

  constructor(@inject(NodeDebug) debug = Debug) {
    this.debug = debug(`storyverse:api:${CommandService.name}`)
  }
  /**
   * Handle Redist pub/sub events for the given WebSocket client.
   */
  handle = async (
    ws: WebSocket,
    {profile, command}: {profile?: Profile | null; command: string}
  ): Promise<void> => {
    this.debug(`Profile: ${profile?.id || 'Unknown'}, Command: ${command}`)

    if (!profile) {
      const action: Output = {
        type: Actions.output,
        output: "Sorry, I'm not sure who you are.",
      }

      ws.send(JSON.stringify(action))

      return
    }

    const parsed = nlp(command)

    // TODO: Handle more than one sentence.
    const phrase = parsed.sentences().list[0]
    const terms = phrase.terms()
    const verbs = terms.filter((term) => term.tags.Verb)

    if (verbs[0]) {
      return this.route(ws, verbs[0], terms, profile)
    }

    this.debug('Unknown phrase:', phrase.terms())

    const action: Output = {
      type: Actions.output,
      output: selectFrom(General.unknown({profile})),
    }

    return ws.send(JSON.stringify(action))
  }

  private route = async (
    ws: WebSocket,
    verb: nlp.Term,
    terms: nlp.Term[],
    profile: Profile
  ): Promise<void> => {
    switch (verb.reduced) {
      case 'say':
        return this.handleSay(ws, without(terms, verb), profile)
      default:
        return this.handleUnknown(ws, verb)
    }
  }

  private handleUnknown = async (
    ws: WebSocket,
    verb: nlp.Term
  ): Promise<void> => {
    const action: Output = {
      type: Actions.output,
      output: `I don't know how to ${verb.text}.`,
    }

    return ws.send(JSON.stringify(action))
  }

  private handleSay = async (
    ws: WebSocket,
    terms: nlp.Term[],
    profile: Profile
  ): Promise<void> => {
    const action: Output = {
      type: Actions.output,
      output: `${profile.displayName} says: ${terms
        .map((term) => `${term.pre || ''}${term.text}${term.post || ''}`)
        .join('')}`,
    }

    return ws.send(JSON.stringify(action))
  }
}

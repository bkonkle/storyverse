import nlp from 'compromise'
import sample from 'lodash/sample'
import {Profile} from '@prisma/client'

export interface CommandContext {
  command: nlp.DefaultDocument
  profile: Profile
  storyId?: string
}

export const selectFrom = (responses: string[]): string =>
  sample(responses) || responses[0]

import nlp from 'compromise'
import {Profile} from '@prisma/client'

export interface CommandContext {
  verb: nlp.Term
  terms: nlp.Term[]
  profile: Profile
}

export namespace Terms {
  export const toString = (term: nlp.Term): string =>
    `${term.pre || ''}${term.text}${term.post || ''}`
}

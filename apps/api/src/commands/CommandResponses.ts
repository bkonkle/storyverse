import sample from 'lodash/sample'
import {Profile} from '@prisma/client'

export const selectFrom = (responses: string[]): string =>
  sample(responses) || responses[0]

export const General = {
  unknown: ({profile}: {profile: Profile}) => [
    `I'm not sure what that means, ${profile.displayName}.`,
    "I'm sorry, I didn't understand that.",
    "I don't understand. Can you rephrase that?",
  ],
}

import nlp from 'compromise'
import fromPairs from 'lodash/fromPairs'

export const toLexicon = (
  lexicon: Record<string, string[]>
): Record<string, string> =>
  Object.keys(lexicon).reduce((memo, tag) => {
    const words = fromPairs(lexicon[tag].map((word) => [word, tag]))

    return {...memo, ...words}
  }, {})

export function clean(command: string): string {
  // Replace some phrases compromise has trouble with
  const substitutions = {
    'pick up': 'get',
    'climb up': 'climb',
    'turn on': 'activate',
    'turn off': 'deactivate',
    'north east': 'northeast',
    'north west': 'northwest',
    'south east': 'southeast',
    'south west': 'southwest',
    cannot: 'can not',
    inside: 'in',
    outside: 'out',
  }

  return command.replace(
    new RegExp(Object.keys(substitutions).join('|'), 'gi'),
    (matched) => substitutions[matched as keyof typeof substitutions]
  )
}

export const lexicon = toLexicon({
  Say: ['say', 'speak', 'utter', 'declare', 'announce', 'remark', 'mention'],
})

export const storyverse: nlp.Plugin = (_doc, world) => {
  world.addTags({
    Command: {
      isA: 'Verb',
    },
  })

  // Add this in a subsequent call because it depends on the call above
  world.addTags({
    Say: {
      isA: 'Command',
    },
  })

  world.addWords(lexicon)

  world.postProcess((_doc) => {
    // pass
  })
}

nlp.extend(storyverse)

export const parse = (command: string): nlp.DefaultDocument =>
  nlp(clean(command))

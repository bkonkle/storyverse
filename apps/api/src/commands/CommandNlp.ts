import nlp from 'compromise'

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

export const storyverse: nlp.Plugin = (_doc, world) => {
  world.addTags({
    Command: {
      isA: 'Verb',
    },
    List: {
      isA: 'List',
    },
    Join: {
      isA: 'Command',
    },
    Say: {
      isA: 'Command',
    },
    Do: {
      isA: 'Command',
    },
  })

  world.postProcess((doc) => {
    doc.match('^list').tag('#List')
    doc.match('^(join|start)').tag('#Join')
    doc.match('^say').tag('#Say')
    doc.match('^do').tag('#Do')
  })
}

nlp.extend(storyverse)

export const parse = (command: string): nlp.DefaultDocument =>
  nlp(clean(command))

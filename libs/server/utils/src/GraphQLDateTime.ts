import {GraphQLScalarType} from 'graphql'
import {Kind} from 'graphql/language'
import {isValid} from 'date-fns'
import {toDate} from 'date-fns-tz'

export default new GraphQLScalarType({
  name: 'DateTime',
  description:
    'The `DateTime` scalar represents a date and time following the ISO 8601 standard',

  serialize(value) {
    // value sent to the client
    return value
  },

  parseValue(value) {
    // value from the client
    if (!isValid(value)) {
      throw new TypeError(
        `DateTime must be in a recognized RFC2822 or ISO 8601 format ${String(
          value
        )}.`
      )
    }

    return toDate(value).toISOString()
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `DateTime cannot represent non string type ${ast.kind}`
      )
    }

    return toDate(ast.value).toISOString()
  },
})

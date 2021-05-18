import {ApolloError} from 'apollo-server-core'

export class NotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, 'NOT_FOUND')

    Object.defineProperty(this, 'name', {value: 'NotFoundError'})
  }
}

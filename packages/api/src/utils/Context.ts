import {GraphQLExtensionStack} from 'graphql-extensions'

export interface Context {
  _extensionStack: GraphQLExtensionStack
}

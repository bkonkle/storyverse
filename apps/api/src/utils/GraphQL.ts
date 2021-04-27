import {ClassProvider, InjectionToken} from 'tsyringe'
import {Class} from 'type-fest'

import {Schema} from '@storyverse/graphql/api'

import {Context} from './Context'

export abstract class Resolvers {
  abstract getAll(): Schema.Resolvers<Context>
}

/**
 * Dependency Injection
 */

export const GraphQLResolvers: InjectionToken<Resolvers> = 'GRAPHQL_RESOLVERS'

export const useResolvers = <T>(
  resolversClass: Class<T>
): ClassProvider<T> & {token: InjectionToken<Resolvers>} => ({
  token: GraphQLResolvers,
  useClass: resolversClass,
})

export type Query = Required<Schema.QueryResolvers<Context>>

export type Mutation = Required<Schema.MutationResolvers<Context>>

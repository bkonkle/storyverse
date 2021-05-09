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

export type Query<
  K extends keyof Required<Schema.QueryResolvers<Context>>
> = Required<Schema.QueryResolvers<Context>>[K]

export type Mutation<
  K extends keyof Required<Schema.MutationResolvers<Context>>
> = Required<Schema.MutationResolvers<Context>>[K]

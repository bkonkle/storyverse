import {Handler} from 'express'
import {createMiddleware} from 'cultivar/express'
import {ApolloServer, graphqlExchange} from 'cultivar/exchanges/graphql'

export const middleware = (apollo: ApolloServer): Handler =>
  createMiddleware({
    exchange: graphqlExchange(apollo),
  })

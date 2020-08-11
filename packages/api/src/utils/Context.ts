import {Request, Response} from 'express'
import {GraphQLExtensionStack} from 'graphql-extensions'

export interface Context {
  _extensionStack: GraphQLExtensionStack
  req: Request
  res: Response
}

export const getContext = (initial: {
  req: Request
  res: Response
}): Omit<Context, '_extensionStack'> => {
  const {req, res} = initial

  return {
    req,
    res,
  }
}

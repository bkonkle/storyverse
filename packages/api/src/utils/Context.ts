import {Request, Response} from 'express'
import {GraphQLExtensionStack} from 'graphql-extensions'

import {Token} from '../authentication/JwtMiddleware'

export interface AppRequest extends Request {
  user?: Token
}

export interface Context {
  _extensionStack: GraphQLExtensionStack
  req: AppRequest
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
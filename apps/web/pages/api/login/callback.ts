import {NextApiRequest, NextApiResponse} from 'next'

import AuthClient from '../../../data/AuthClient'

const auth0 = AuthClient.init()

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await auth0.handleCallback(req, res, {redirectUri: '/home'})
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}

import {NextApiRequest, NextApiResponse} from 'next'

import AuthClient from '../../data/AuthClient'

const auth0 = AuthClient.init()

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  try {
    await auth0.handleProfile(req, res, {})
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
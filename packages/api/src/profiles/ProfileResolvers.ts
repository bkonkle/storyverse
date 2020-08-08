import {Context} from '../utils/Context'
import {QueryResolvers} from '../Schema'

export const profile: QueryResolvers['profile'] = async (
  _,
  {id},
  context: Context
) => {
  console.log(`>- id ->`, id)
  console.log(`>- context ->`, context)

  throw new Error()
}

const resolvers: Pick<QueryResolvers, 'profile'> = {
  profile,
}

export default resolvers

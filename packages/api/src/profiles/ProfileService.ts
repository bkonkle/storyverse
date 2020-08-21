import {Repository, getRepository} from 'typeorm'
import Typeorm from 'cultivar/utils/typeorm'

import Profile from './Profile.entity'

export const init = (
  repository?: Repository<Profile>
): Typeorm.EntityService<Profile> =>
  Typeorm.init(repository || getRepository(Profile))

export default {init}

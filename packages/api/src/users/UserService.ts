import {Repository, getRepository} from 'typeorm'
import Typeorm from 'cultivar/utils/typeorm'

import User from './User.entity'

export type UserService = ReturnType<typeof init>

export const init = (repository?: Repository<User>) =>
  Typeorm.init(repository || getRepository(User))

export default {init}

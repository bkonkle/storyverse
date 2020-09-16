import {Repository, getRepository} from 'typeorm'
import {Typeorm} from '../lib/services'

import User from './User.entity'

export type UserService = ReturnType<typeof init>

export const init = (repository?: Repository<User>) =>
  Typeorm.init(repository || getRepository(User))

export default {init}

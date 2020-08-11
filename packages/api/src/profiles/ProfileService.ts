import {Repository, getRepository} from 'typeorm'
import Typeorm from 'cultivar/utils/typeorm'

import Profile from './Profile.entity'

export type ProfileService = ReturnType<typeof init>

/**
 * Initialize the ProfileService
 */
export const init = (repository?: Repository<Profile>) => {
  const repo = repository || getRepository(Profile)
  const orm = Typeorm.init(repo)

  return {
    get: (id: string) => orm.findOne({where: {id}}),
    find: orm.find,
    findOne: orm.findOne,
    create: orm.create,
    update: orm.update,
    delete: orm.delete,
  }
}

export default {init}

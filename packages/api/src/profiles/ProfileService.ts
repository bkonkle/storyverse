import {Repository, getRepository} from 'typeorm'
import Typeorm from 'cultivar/utils/typeorm'

import {CreateProfileInput, UpdateProfileInput} from '../Schema'
import Profile from './Profile.entity'

export type ProfileService = ReturnType<typeof init>

/**
 * Initialize the ProfileService
 */
export const init = (repository?: Repository<Profile>) => {
  const repo = repository || getRepository(Profile)
  const orm = Typeorm.init(repo)

  return {
    find: orm.find,
    findOne: orm.findOne,
    get: (id: string) => orm.findOne({where: {id}}),
    create: (input: CreateProfileInput) => orm.create(input),
    update: (id: string, input: UpdateProfileInput) => orm.update(id, input),
    delete: (id: string) => orm.delete(id),
  }
}

export default {init}

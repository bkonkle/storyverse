import {Repository, getRepository} from 'typeorm'
import {Source, fromPromise} from 'wonka'

import Profile from './Profile.entity'
import {CreateProfileInput, UpdateProfileInput} from '../Schema'

export type ProfileService = ReturnType<typeof init>

/**
 * Get a single existing Profile
 */
export const get = ({repo}: {repo: Repository<Profile>}) => (
  id: string
): Source<Profile | undefined> => fromPromise(repo.findOne(id))

/**
 * Create a new Profile row
 */
export const create = ({repo}: {repo: Repository<Profile>}) => (
  input: CreateProfileInput
): Source<Profile | undefined> => fromPromise(repo.save(input))

/**
 * Update an existing Profile row
 */
export const update = ({repo}: {repo: Repository<Profile>}) => (
  input: UpdateProfileInput
): Source<Profile | undefined> => fromPromise(repo.save(input))

/**
 * Initialize the ProfileService
 */
export const init = (repository?: Repository<Profile>) => {
  const repo = repository || getRepository(Profile)

  return {
    get: get({repo}),
    create: create({repo}),
    update: update({repo}),
  }
}

export default {init}

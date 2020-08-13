import Nope from 'nope-validator'
import {fromValidation, uuidRegex} from 'cultivar/utils/validation'

import {ProfilesOrderBy} from '../Schema'

export const get = Nope.object().shape({
  id: Nope.string()
    .regex(uuidRegex, 'Please provide a valid Profile id')
    .required(),
})

export const validateGet = fromValidation(get)

export const getMany = Nope.object().shape({
  where: Nope.object().shape({
    id: Nope.string().regex(uuidRegex, 'Please provide a valid Profile id'),
    email: Nope.string().email('Please provide a valid email address'),
    displayName: Nope.string(),
    picture: Nope.string(),
    content: Nope.object(),
    userId: Nope.string(),
    createdAt: Nope.date('Please provide a valid createdAt DateTime'),
    updatedAt: Nope.date('Please provide a valid updatedAt DateTime'),
  }),
  orderBy: Nope.string().oneOf(Object.values(ProfilesOrderBy)),
  pageSize: Nope.number(),
  page: Nope.number(),
})

export const validateGetMany = fromValidation(getMany)

export const create = Nope.object().shape({
  email: Nope.string().email('Please provide a valid email address').required(),
  userId: Nope.string()
    .regex(uuidRegex, 'Please provide a valid userId.')
    .required(),
  displayName: Nope.string().atMost(
    300,
    'Please use a displayName less than 300 characters.'
  ),
  picture: Nope.string().url('Please provide a valid picture url.'),
  content: Nope.object(),
})

export const validateCreate = fromValidation(create)

export const update = Nope.object()
  .extend(create)
  .shape({
    email: Nope.string().email(),
    userId: Nope.string().regex(uuidRegex, 'Please provide a valid userId.'),
  })

export const validateUpdate = fromValidation(update)

import Nope from 'nope-validator'
import {fromValidation} from 'cultivar/utils/validation'

export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.compile()

export const getById = Nope.object().shape({
  id: Nope.string()
    .regex(uuidRegex, 'Please provide a valid Profile id')
    .required(),
})

export const validateGetById = fromValidation(getById)

export const create = Nope.object().shape({
  email: Nope.string().email().required(),
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

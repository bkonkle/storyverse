import * as yup from 'yup'
import {withValidation, uuidRegex} from 'cultivar/utils/validation'

import {
  ProfilesOrderBy,
  QueryGetProfileArgs,
  QueryGetManyProfilesArgs,
  CreateProfileInput,
  UpdateProfileInput,
  MutationDeleteProfileArgs,
} from '../Schema'

export const get = yup
  .object()
  .shape<QueryGetProfileArgs>({
    id: yup
      .string()
      .matches(uuidRegex, 'Please provide a valid Profile id')
      .required(),
  })
  .required()

export const validateGet = withValidation(get)

export const getMany = yup
  .object()
  .shape<QueryGetManyProfilesArgs>({
    where: yup.object().shape({
      id: yup.string().matches(uuidRegex, 'Please provide a valid Profile id'),
      email: yup.string().email('Please provide a valid email address'),
      displayName: yup.string(),
      picture: yup.string(),
      content: yup.object(),
      userId: yup.string(),
      createdAt: yup.date(),
      updatedAt: yup.date(),
    }),
    orderBy: yup.array(
      yup.string().oneOf(Object.values(ProfilesOrderBy)).required()
    ),
    pageSize: yup.number(),
    page: yup.number(),
  })
  .required()

export const validateGetMany = withValidation(getMany)

export const create = yup
  .object()
  .shape<CreateProfileInput>({
    email: yup
      .string()
      .email('Please provide a valid email address')
      .required(),
    userId: yup
      .string()
      .matches(uuidRegex, 'Please provide a valid userId.')
      .required(),
    displayName: yup
      .string()
      .max(300, 'Please use a displayName less than 300 characters.'),
    picture: yup.string().url('Please provide a valid picture url.'),
    content: yup.object(),
  })
  .required()

export const validateCreate = withValidation(create)

export const update = yup
  .object()
  .shape<UpdateProfileInput>({
    email: yup.string().email(),
    userId: yup.string().matches(uuidRegex, 'Please provide a valid userId.'),
    displayName: yup
      .string()
      .max(300, 'Please use a displayName less than 300 characters.'),
    picture: yup.string().url('Please provide a valid picture url.'),
    content: yup.object(),
  })
  .required()

export const validateUpdate = withValidation(update)

export const remove = yup
  .object()
  .shape<MutationDeleteProfileArgs>({
    id: yup
      .string()
      .matches(uuidRegex, 'Please provide a valid Profile id')
      .required(),
  })
  .required()

export const validateDelete = withValidation(remove)

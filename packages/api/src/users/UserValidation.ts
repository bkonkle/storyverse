import * as yup from 'yup'
import {uuidRegex} from 'cultivar/services'

import {
  UsersOrderBy,
  QueryGetUserArgs,
  QueryGetManyUsersArgs,
  UserCondition,
  CreateUserInput,
  UpdateUserInput,
  MutationDeleteUserArgs,
} from '../Schema'

export const get = yup
  .object()
  .shape<QueryGetUserArgs>({
    id: yup
      .string()
      .matches(uuidRegex, 'Please provide a valid User id')
      .required(),
  })
  .required()

export const getMany = yup
  .object()
  .shape<QueryGetManyUsersArgs>({
    where: yup.object().shape<UserCondition>({
      id: yup.string().matches(uuidRegex, 'Please provide a valid User id'),
      username: yup.string(),
      isActive: yup.boolean(),
      createdAt: yup.date(),
      updatedAt: yup.date(),
    }),
    orderBy: yup.array(
      yup.string().oneOf(Object.values(UsersOrderBy)).required()
    ),
    pageSize: yup.number(),
    page: yup.number(),
  })
  .required()

export const create = yup
  .object()
  .shape<CreateUserInput>({
    username: yup.string().required(),
  })
  .required()

export const update = yup
  .object()
  .shape<UpdateUserInput>({
    username: yup.string(),
    isActive: yup.boolean(),
  })
  .required()

export const remove = yup
  .object()
  .shape<MutationDeleteUserArgs>({
    id: yup
      .string()
      .matches(uuidRegex, 'Please provide a valid User id')
      .required(),
  })
  .required()

import * as yup from 'yup'
import {uuidRegex} from '../lib/resolvers'

import {
  UsersOrderBy,
  QueryGetUserArgs,
  QueryGetManyUsersArgs,
  UserCondition,
  MutationDeleteUserArgs,
  MutationUpdateUserArgs,
  MutationCreateUserArgs,
} from '../Schema'

export namespace Schema {
  export const get: yup.ObjectSchema<QueryGetUserArgs> = yup
    .object()
    .shape<QueryGetUserArgs>({
      id: yup
        .string()
        .matches(uuidRegex, 'Please provide a valid User id')
        .required(),
    })
    .required()

  export const getMany: yup.ObjectSchema<QueryGetManyUsersArgs> = yup
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

  export const create: yup.ObjectSchema<MutationCreateUserArgs> = yup
    .object()
    .shape<MutationCreateUserArgs>({
      input: yup
        .object()
        .shape<MutationCreateUserArgs['input']>({
          username: yup.string().required(),
        })
        .required(),
    })
    .required()

  export const update: yup.ObjectSchema<MutationUpdateUserArgs> = yup
    .object()
    .shape<MutationUpdateUserArgs>({
      id: yup
        .string()
        .matches(uuidRegex, 'Please provide a valid User id')
        .required(),
      input: yup
        .object()
        .shape<MutationUpdateUserArgs['input']>({
          username: yup.string(),
          isActive: yup.boolean(),
        })
        .required(),
    })
    .required()

  export const remove: yup.ObjectSchema<MutationDeleteUserArgs> = yup
    .object()
    .shape<MutationDeleteUserArgs>({
      id: yup
        .string()
        .matches(uuidRegex, 'Please provide a valid User id')
        .required(),
    })
    .required()
}

export const get = Schema.get.validate
export const getMany = Schema.getMany.validate
export const create = Schema.create.validate
export const update = Schema.update.validate
export const remove = Schema.remove.validate

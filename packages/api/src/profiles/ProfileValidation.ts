import * as yup from 'yup'
import {uuidRegex} from '../lib/resolvers'

import {
  ProfilesOrderBy,
  QueryGetProfileArgs,
  QueryGetManyProfilesArgs,
  MutationCreateProfileArgs,
  MutationUpdateProfileArgs,
  MutationDeleteProfileArgs,
} from '../Schema'

export namespace Schema {
  export const get: yup.ObjectSchema<QueryGetProfileArgs> = yup
    .object()
    .shape<QueryGetProfileArgs>({
      id: yup
        .string()
        .matches(uuidRegex, 'Please provide a valid Profile id')
        .required(),
    })
    .required()

  export const getMany: yup.ObjectSchema<QueryGetManyProfilesArgs> = yup
    .object()
    .shape<QueryGetManyProfilesArgs>({
      where: yup.object().shape({
        id: yup
          .string()
          .matches(uuidRegex, 'Please provide a valid Profile id'),
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

  export const create: yup.ObjectSchema<MutationCreateProfileArgs> = yup
    .object()
    .shape<MutationCreateProfileArgs>({
      input: yup
        .object()
        .shape<MutationCreateProfileArgs['input']>({
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
        .required(),
    })
    .required()

  export const update: yup.ObjectSchema<MutationUpdateProfileArgs> = yup
    .object()
    .shape<MutationUpdateProfileArgs>({
      id: yup
        .string()
        .matches(uuidRegex, 'Please provide a valid Profile id')
        .required(),
      input: yup
        .object()
        .shape<MutationUpdateProfileArgs['input']>({
          email: yup.string().email(),
          userId: yup
            .string()
            .matches(uuidRegex, 'Please provide a valid userId.'),
          displayName: yup
            .string()
            .max(300, 'Please use a displayName less than 300 characters.'),
          picture: yup.string().url('Please provide a valid picture url.'),
          content: yup.object(),
        })
        .required(),
    })
    .required()

  export const remove: yup.ObjectSchema<MutationDeleteProfileArgs> = yup
    .object()
    .shape<MutationDeleteProfileArgs>({
      id: yup
        .string()
        .matches(uuidRegex, 'Please provide a valid Profile id')
        .required(),
    })
    .required()
}

export const get = Schema.get.validate.bind(Schema.get)
export const getMany = Schema.getMany.validate.bind(Schema.getMany)
export const create = Schema.create.validate.bind(Schema.create)
export const update = Schema.update.validate.bind(Schema.update)
export const remove = Schema.remove.validate.bind(Schema.remove)

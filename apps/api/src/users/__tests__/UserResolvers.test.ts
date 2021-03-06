import {PrismaClient} from '@prisma/client'
import {container} from 'tsyringe'
import {mockDeep} from 'jest-mock-extended'
import {GraphQLResolveInfo} from 'graphql'

import {Context} from '@storyverse/api/utils'

import UserFactory from '../../../test/factories/UserFactory'
import UserResolvers from '../UserResolvers'

describe('UserResolvers', () => {
  let resolvers: UserResolvers

  const prisma = mockDeep<PrismaClient>()

  const parent = {}

  const username = 'test-username'
  const context = mockDeep<Context>({
    req: {user: {sub: username}},
  })

  const info = mockDeep<GraphQLResolveInfo>()

  beforeAll(() => {
    container.register(PrismaClient, {useValue: prisma})

    resolvers = container.resolve(UserResolvers)
  })

  describe('getCurrentUser()', () => {
    const user = UserFactory.make()

    it('uses Prisma to find the first matching User', async () => {
      const args = {}

      prisma.user.findFirst.mockResolvedValueOnce(user)

      const result = await resolvers.getCurrentUser(parent, args, context, info)

      expect(prisma.user.findFirst).toBeCalledTimes(1)
      expect(prisma.user.findFirst).toBeCalledWith({
        include: {profile: true},
        where: {username},
      })

      expect(result).toEqual(user)
    })
  })
})

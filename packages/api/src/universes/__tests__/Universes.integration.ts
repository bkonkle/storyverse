import {PrismaClient} from '@prisma/client'

import App from '../../App'
import OAuth2 from '../../utils/__tests__/OAuth2'
import GraphQL from '../../utils/__tests__/GraphQL'
import Validation from '../../utils/__tests__/Validation'
import {dbCleaner} from '../../utils/__tests__/Prisma'
import ProfileFactory from '../../utils/__tests__/factories/ProfileFactory'
import UniverseFactory from '../../utils/__tests__/factories/UniverseFactory'
import {Mutation, Universe, User, Profile} from '../../Schema'

describe('Universes', () => {
  let graphql: GraphQL

  let user: User
  let profile: Profile

  // let otherUser: User
  // let otherProfile: Profile

  const {credentials} = OAuth2.init()
  const prisma = new PrismaClient()

  const tables = ['User', 'Profile', 'Universe']

  beforeAll(async () => {
    await dbCleaner(prisma, tables)

    const app = await App.init()

    graphql = new GraphQL(app)
  })

  beforeAll(async () => {
    const {username} = credentials

    if (!username) {
      throw new Error('No username found in OAuth2 credentials')
    }

    user = await prisma.user.create({data: {username, isActive: true}})
    profile = await prisma.profile.create({
      include: {
        user: true,
      },
      data: ProfileFactory.makeCreateInput({userId: user.id}),
    })
  })

  // beforeAll(async () => {
  //   const {username} = altCredentials

  //   if (!username) {
  //     throw new Error('No username found in OAuth2 credentials')
  //   }

  //   otherUser = await prisma.user.create({data: {username, isActive: true}})
  //   otherProfile = await prisma.profile.create({
  //     include: {
  //       user: true,
  //     },
  //     data: ProfileFactory.makeCreateInput({userId: otherUser.id}),
  //   })
  // })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  describe('Mutation: createUniverse', () => {
    const mutation = `
      mutation CreateUniverse($input: CreateUniverseInput!) {
        createUniverse(input: $input) {
          universe {
            id
            name
            description
            ownerProfileId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownerProfileId'] as const

    it('creates a new universe', async () => {
      const {token} = credentials
      const universe = UniverseFactory.makeCreateInput({
        ownerProfileId: profile.id,
      })
      const variables = {input: universe}

      const expected: Pick<Universe, typeof fields[number]> = {
        ...variables.input,
        id: expect.stringMatching(Validation.uuidRegex),
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data?.createUniverse).toHaveProperty(
        'universe',
        expect.objectContaining(expected)
      )

      const created = await prisma.universe.findFirst({
        where: {
          id: data?.createUniverse?.universe?.id,
        },
      })

      if (!created) {
        fail('No universe created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.createUniverse.universe?.id,
      })

      await prisma.universe.delete({
        where: {
          id: created.id,
        },
      })
    })
  })
})

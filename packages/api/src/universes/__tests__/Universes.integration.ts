import {omit, pick} from 'lodash'

import App from '../../App'
import OAuth2 from '../../test/OAuth2'
import GraphQL from '../../test/GraphQL'
import Validation from '../../test/Validation'
import {dbCleaner} from '../../test/Prisma'
import ProfileFactory from '../../test/factories/ProfileFactory'
import UniverseFactory from '../../test/factories/UniverseFactory'
import {Mutation, User, Profile} from '../../Schema'
import Prisma from '../../utils/Prisma'

describe('Universes', () => {
  let graphql: GraphQL

  let user: User
  let profile: Profile

  let otherUser: User
  let otherProfile: Profile

  const {altCredentials, credentials} = OAuth2.init()
  const prisma = Prisma.init()

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

  beforeAll(async () => {
    const {username} = altCredentials

    if (!username) {
      throw new Error('No username found in OAuth2 credentials')
    }

    otherUser = await prisma.user.create({data: {username, isActive: true}})
    otherProfile = await prisma.profile.create({
      include: {
        user: true,
      },
      data: ProfileFactory.makeCreateInput({userId: otherUser.id}),
    })
  })

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
            ownerProfile {
              id
              displayName
            }
          }
        }
      }
    `
    const fields = [
      'id',
      'name',
      'description',
      'ownerProfile.id',
      'ownerProfile.displayName',
    ]

    it('creates a new universe', async () => {
      const {token} = credentials
      const universe = UniverseFactory.makeCreateInput({
        ownerProfileId: profile.id,
      })
      const variables = {input: universe}

      const expected = pick(
        {
          ...universe,
          id: expect.stringMatching(Validation.uuidRegex),
        },
        fields
      )

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

    it('requires a name and an ownerProfileId', async () => {
      const {token} = credentials
      const universe = omit(
        UniverseFactory.makeCreateInput({ownerProfileId: profile.id}),
        ['name', 'ownerProfileId']
      )
      const variables = {input: universe}

      const body = await graphql.mutation(mutation, variables, {
        token,
        statusCode: 400,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: expect.stringContaining(
            'Field "name" of required type "String!" was not provided.'
          ),
        }),
        expect.objectContaining({
          message: expect.stringContaining(
            'Field "ownerProfileId" of required type "UUID!" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const universe = UniverseFactory.makeCreateInput({
        ownerProfileId: profile.id,
      })
      const variables = {input: universe}

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('requires authorization', async () => {
      const {token} = credentials
      const universe = UniverseFactory.makeCreateInput({
        ownerProfileId: otherProfile.id,
      })
      const variables = {input: universe}

      const body = await graphql.mutation(mutation, variables, {
        token,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authorization required',
          extensions: {code: 'FORBIDDEN'},
        }),
      ])
    })
  })
})

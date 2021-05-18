/* eslint-disable @typescript-eslint/no-non-null-assertion */
import faker from 'faker'
import {omit, pick} from 'lodash'

import {
  Mutation,
  User,
  Profile,
  CreateStoryInput,
  Story,
  Query,
  Series,
  Universe,
} from '@storyverse/graphql/api/Schema'
import {Prisma} from '@storyverse/server/utils'

import App from '../../App'
import OAuth2 from '../../../test/OAuth2'
import GraphQL from '../../../test/GraphQL'
import Validation from '../../../test/Validation'
import {dbCleaner} from '../../../test/Prisma'
import ProfileFactory from '../../../test/factories/ProfileFactory'
import StoryFactory from '../../../test/factories/StoryFactory'
import TestData from '../../../test/TestData'
import UniverseFactory from '../../../test/factories/UniverseFactory'
import * as UniverseRoles from '../../universes/UniverseRoles'
import * as UniverseUtils from '../../universes/UniverseUtils'
import * as SeriesRoles from '../../series/SeriesRoles'
import * as SeriesUtils from '../../series/SeriesUtils'
import SeriesFactory from '../../../test/factories/SeriesFactory'

describe('Story', () => {
  let graphql: GraphQL

  let user: User
  let profile: Profile
  let universe: Universe
  let series: Series

  let otherUser: User
  let otherProfile: Profile
  let otherUniverse: Universe
  let otherSeries: Series

  const {altCredentials, credentials} = OAuth2.init()
  const prisma = Prisma.init()

  const tables = ['User', 'Profile', 'Story']

  const createStory = (input: CreateStoryInput) =>
    prisma.story.create({
      include: {
        series: {
          include: {
            universe: {include: {ownerProfile: {include: {user: true}}}},
          },
        },
      },
      data: input,
    })

  const deleteStory = (id: string) => prisma.story.delete({where: {id}})

  beforeAll(async () => {
    await dbCleaner(prisma, tables)

    const app = App.create()

    graphql = new GraphQL(await app.init())
  })

  beforeAll(async () => {
    const {username} = credentials

    if (!username) {
      throw new Error('No username found in OAuth2 credentials')
    }

    user = await prisma.user.create({data: {username, isActive: true}})
    profile = await prisma.profile.create({
      include: {user: true},
      data: ProfileFactory.makeCreateInput({userId: user.id}),
    })
    universe = await prisma.universe.create({
      include: {ownerProfile: {include: {user: true}}},
      data: UniverseFactory.makeCreateInput({ownerProfileId: profile.id}),
    })
    series = await prisma.series.create({
      include: {
        universe: {include: {ownerProfile: {include: {user: true}}}},
      },
      data: SeriesFactory.makeCreateInput({universeId: universe.id}),
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
    otherUniverse = await prisma.universe.create({
      include: {ownerProfile: {include: {user: true}}},
      data: UniverseFactory.makeCreateInput({ownerProfileId: otherProfile.id}),
    })
    otherSeries = await prisma.series.create({
      include: {
        universe: {include: {ownerProfile: {include: {user: true}}}},
      },
      data: SeriesFactory.makeCreateInput({universeId: otherUniverse.id}),
    })
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  describe('Mutation: createStory', () => {
    const mutation = `
      mutation CreateStory($input: CreateStoryInput!) {
        createStory(input: $input) {
          story {
            id
            name
            summary
            seriesId
          }
        }
      }
    `
    const fields = ['id', 'name', 'summary', 'seriesId']

    it('creates a new story', async () => {
      const {token} = credentials
      const story = StoryFactory.makeCreateInput({
        seriesId: series.id,
      })
      const variables = {input: story}

      const expected = pick(
        {
          ...story,
          id: expect.stringMatching(Validation.uuidRegex),
        },
        fields
      )

      const subject = SeriesUtils.getSubject(series.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: SeriesRoles.Manager.key,
          profileId: profile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createStory'>>(
        mutation,
        variables,
        {token}
      )

      expect(data?.createStory).toHaveProperty(
        'story',
        expect.objectContaining(expected)
      )

      const created = await prisma.story.findFirst({
        where: {
          id: data?.createStory?.story?.id,
        },
      })

      if (!created) {
        fail('No story created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.createStory.story?.id,
      })

      await prisma.story.delete({
        where: {id: created.id},
      })
      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })

    it('requires a name and a seriesId', async () => {
      const {token} = credentials
      const story = omit(StoryFactory.makeCreateInput({seriesId: series.id}), [
        'name',
        'seriesId',
      ])
      const variables = {input: story}

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
            'Field "seriesId" of required type "ID!" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const story = StoryFactory.makeCreateInput({
        seriesId: series.id,
      })
      const variables = {input: story}

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
      const story = StoryFactory.makeCreateInput({
        seriesId: series.id,
      })
      const variables = {input: story}

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

    it('allows those with the ManageSeries permission', async () => {
      const {token} = altCredentials
      const story = StoryFactory.makeCreateInput({
        seriesId: series.id,
      })
      const variables = {input: story}

      const expected = pick(
        {
          ...story,
          id: expect.stringMatching(Validation.uuidRegex),
        },
        fields
      )

      const subject = UniverseUtils.getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: UniverseRoles.Manager.key,
          profileId: otherProfile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createStory'>>(
        mutation,
        variables,
        {token}
      )

      expect(data?.createStory).toHaveProperty(
        'story',
        expect.objectContaining(expected)
      )

      await prisma.story.delete({
        where: {id: data?.createStory?.story?.id},
      })
      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })
  })

  describe('Query: getStory', () => {
    const query = `
      query GetStory($id: ID!) {
        getStory(id: $id) {
          id
          name
          summary
          seriesId
        }
      }
    `
    const fields = ['id', 'name', 'summary', 'seriesId']

    const story = new TestData(
      () => createStory(StoryFactory.makeCreateInput({seriesId: series.id})),
      deleteStory
    )

    it('retrieves an existing story', async () => {
      const {token} = credentials
      const variables = {id: story.id}

      const {data} = await graphql.query<Pick<Query, 'getStory'>>(
        query,
        variables,
        {token}
      )

      expect(data.getStory).toEqual(pick(story.value, fields))
    })

    it('returns nothing when no story is found', async () => {
      const {token} = credentials
      const variables = {id: story.id}

      await story.delete()

      const {data} = await graphql.query<Pick<Query, 'getStory'>>(
        query,
        variables,
        {token}
      )

      expect(data.getStory).toBeFalsy()
    })
  })

  describe('Query: getManyStories', () => {
    const query = `
      query GetManyStories(
        $where: StoryCondition
        $orderBy: [StoriesOrderBy!]
        $pageSize: Int
        $page: Int
      ) {
        getManyStories(
        where: $where
        orderBy: $orderBy
        pageSize: $pageSize
        page: $page
        ) {
          data {
            id
            name
            summary
            series {
              id
            }
          }
          count
          total
          page
          pageCount
        }
      }
    `
    const fields = ['id', 'name', 'summary', 'series.id']

    const story = new TestData(
      () => createStory(StoryFactory.makeCreateInput({seriesId: series.id})),
      deleteStory
    )
    const otherStory = new TestData(
      () =>
        createStory(StoryFactory.makeCreateInput({seriesId: otherSeries.id})),
      deleteStory
    )

    it('queries existing stories', async () => {
      const {token} = credentials
      const variables = {}

      const {data} = await graphql.query<Pick<Query, 'getManyStories'>>(
        query,
        variables,
        {token}
      )

      expect(data.getManyStories).toEqual({
        data: expect.arrayContaining([
          pick(story.value, fields),
          pick(otherStory.value, fields),
        ]),
        count: 2,
        page: 1,
        pageCount: 1,
        total: 2,
      })
    })
  })

  describe('Mutation: updateStory', () => {
    const mutation = `
      mutation UpdateStory($id: ID!, $input: UpdateStoryInput!) {
        updateStory(id: $id, input: $input) {
          story {
            id
            name
            summary
            seriesId
          }
        }
      }
    `
    const fields = ['id', 'name', 'summary', 'seriesId'] as const

    const story = new TestData(
      () => createStory(StoryFactory.makeCreateInput({seriesId: series.id})),
      deleteStory
    )

    it('updates an existing story', async () => {
      const {token} = credentials
      const variables = {
        id: story.id,
        input: {name: faker.random.word()},
      }

      const expected: Pick<Story, typeof fields[number]> = {
        ...pick(story.value!, fields),
        name: variables.input.name,
      }

      story.resetAfter()

      const subject = SeriesUtils.getSubject(series.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: SeriesRoles.Manager.key,
          profileId: profile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'updateStory'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateStory).toHaveProperty(
        'story',
        expect.objectContaining(expected)
      )

      const updated = await prisma.story.findFirst({
        where: {id: story.id},
      })
      expect(updated).toMatchObject(expected)

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })

    it('returns an error if no existing story was found', async () => {
      const {token} = credentials
      const variables = {
        id: faker.datatype.uuid(),
        input: {name: faker.random.word()},
      }

      const body = await graphql.mutation<Pick<Mutation, 'updateStory'>>(
        mutation,
        variables,
        {token, warn: false}
      )

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Not found',
          extensions: {code: 'NOT_FOUND'},
        }),
      ])
    })

    it('requires authentication', async () => {
      const variables = {
        id: story.id,
        input: {name: faker.random.word()},
      }

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('requires authorization', async () => {
      const {token} = altCredentials
      const variables = {
        id: story.id,
        input: {name: faker.random.word()},
      }

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

    it('allows users with the ManageSeries permission', async () => {
      const {token} = altCredentials
      const variables = {
        id: story.id,
        input: {name: faker.random.word()},
      }

      const expected: Pick<Story, typeof fields[number]> = {
        ...pick(story.value!, fields),
        name: variables.input.name,
      }

      story.resetAfter()

      const subject = UniverseUtils.getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: UniverseRoles.Manager.key,
          profileId: otherProfile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'updateStory'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateStory).toHaveProperty(
        'story',
        expect.objectContaining(expected)
      )

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })
  })

  describe('Mutation: deleteStory', () => {
    const mutation = `
      mutation DeleteStory($id: ID!) {
        deleteStory(id: $id) {
          story {
            id
          }
        }
      }
    `

    const story = new TestData(
      () => createStory(StoryFactory.makeCreateInput({seriesId: series.id})),
      deleteStory
    )

    it('deletes an existing story', async () => {
      const {token} = credentials
      const variables = {id: story.id}

      story.resetAfter()

      const subject = SeriesUtils.getSubject(series.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: SeriesRoles.Manager.key,
          profileId: profile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteStory'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteStory).toEqual({
        story: {
          id: story.id,
        },
      })

      const deleted = await prisma.story.findFirst({
        where: {id: story.id},
      })
      expect(deleted).toBeNull()

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })

    it('returns an error if no existing story was found', async () => {
      const {token} = credentials
      const variables = {id: faker.datatype.uuid()}

      const body = await graphql.mutation<Pick<Mutation, 'deleteStory'>>(
        mutation,
        variables,
        {token, warn: false}
      )

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Not found',
          extensions: {code: 'NOT_FOUND'},
        }),
      ])
    })

    it('requires authentication', async () => {
      const variables = {id: story.id}

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('requires authorization', async () => {
      const {token} = altCredentials
      const variables = {id: story.id}

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

    it('allows users with the ManageSeries permission', async () => {
      const {token} = altCredentials
      const variables = {id: story.id}

      story.resetAfter()

      const subject = UniverseUtils.getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: UniverseRoles.Manager.key,
          profileId: otherProfile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteStory'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteStory).toEqual({
        story: {
          id: story.id,
        },
      })

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })
  })
})

import {pick} from 'ramda'
import {
  GraphQL,
  dbCleaner,
  getDb,
  getToken,
  initGraphQL,
  mockJwt,
} from '@graft/server/test'

import config from '../knexfile'
import {init} from './TestApp'
import {UserFactory} from './factories'

jest.mock('express-jwt')

describe('UserIntegration', () => {
  let graphql: GraphQL

  const token = getToken()
  mockJwt(token)

  const db = getDb(config)

  beforeAll(async () => {
    const {app} = await init()
    graphql = initGraphQL(app, token)
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    await dbCleaner(db)
  })

  const createUsers = async (
    extras: [object, object] = [undefined, undefined]
  ) => {
    const [extra1, extra2] = extras

    return db('users')
      .insert([
        pick(['username'], UserFactory.make({username: token.sub, ...extra1})),
        pick(['username'], UserFactory.make(extra2)),
      ])
      .returning('*')
  }

  describe('Query: allUsers', () => {
    it('lists users', async () => {
      const [user] = await createUsers()

      const query = `
        query allUsers {
          allUsers {
            nodes {
              id
              username
            }
          }
        }
      `

      const {data} = await graphql.query(query)

      expect(data?.allUsers).toHaveProperty('nodes', [
        {
          id: user.id,
          username: user.username,
        },
      ])
    })
  })

  describe('Query: userById', () => {
    it('retrieves a user', async () => {
      const [user] = await createUsers()

      const query = `
        query userById($id: UUID!) {
          userById (id: $id) {
            id
            username
          }
        }
      `

      const variables = {id: user.id}

      const {data} = await graphql.query(query, variables)

      expect(data).toHaveProperty('userById', {
        id: user.id,
        username: user.username,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, user] = await createUsers()

      const query = `
        query userById($id: UUID!) {
          userById (id: $id) {
            id
            username
          }
        }
      `

      const variables = {id: user.id}

      const {data} = await graphql.query(query, variables, {warn: false})

      expect(data.userById).toBe(null)
    })
  })

  describe('Mutation: createUser', () => {
    it('creates a user', async () => {
      const query = `
        mutation createUser($input: CreateUserInput!) {
          createUser(input: $input) {
            user {
              id
              username
            }
          }
        }
      `

      const user = UserFactory.make({username: token.sub})

      const variables = {input: {user}}

      const {data} = await graphql.query(query, variables)

      expect(data?.createUser).toHaveProperty(
        'user',
        expect.objectContaining({username: user.username})
      )
    })

    it('requires the token sub to match the username', async () => {
      const query = `
        mutation createUser($input: CreateUserInput!) {
          createUser(input: $input) {
            user {
              id
              username
            }
          }
        }
      `

      const user = UserFactory.make()

      const variables = {input: {user}}

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            'new row violates row-level security policy for table "users"',
        }),
      ])
    })
  })

  describe('Mutation: updateUserById', () => {
    it('updates an existing user', async () => {
      const [user] = await createUsers()

      const query = `
        mutation updateUserById($input: UpdateUserByIdInput!) {
          updateUserById(input: $input) {
            user {
              id
              isActive
            }
          }
        }
      `

      const input = {isActive: false}

      const variables = {
        input: {id: user.id, userPatch: input},
      }

      const {data} = await graphql.query(query, variables)

      expect(data?.updateUserById).toHaveProperty('user', {
        id: user.id,
        isActive: false,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, user] = await createUsers()

      const query = `
        mutation updateUserById($input: UpdateUserByIdInput!) {
          updateUserById(input: $input) {
            user {
              id
              isActive
            }
          }
        }
      `

      const input = {isActive: false}

      const variables = {
        input: {id: user.id, userPatch: input},
      }

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            "No values were updated in collection 'users' because no values you can update were found matching these criteria.",
        }),
      ])
    })
  })

  describe('Mutation: deleteUserById', () => {
    it('updates an existing user', async () => {
      const [user] = await createUsers()

      const query = `
        mutation deleteUserById($input: DeleteUserByIdInput!) {
          deleteUserById(input: $input) {
            user {
              id
              username
            }
          }
        }
      `

      const variables = {input: {id: user.id}}

      const {data} = await graphql.query(query, variables)

      expect(data?.deleteUserById).toHaveProperty('user', {
        id: user.id,
        username: user.username,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, user] = await createUsers()

      const query = `
        mutation deleteUserById($input: DeleteUserByIdInput!) {
          deleteUserById(input: $input) {
            user {
              id
              username
            }
          }
        }
      `

      const variables = {input: {id: user.id}}

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            "No values were deleted in collection 'users' because no values you can delete were found matching these criteria.",
        }),
      ])
    })
  })
})

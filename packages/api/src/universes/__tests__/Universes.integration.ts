import faker from 'faker'

import App from '../../App'
import OAuth2 from '../../utils/__tests__/OAuth2'
import GraphQL from '../../utils/__tests__/GraphQL'
import Validation from '../../utils/__tests__/Validation'
import UniverseFactory from '../../utils/__tests__/factories/UniverseFactory'
import {Mutation, Universe} from '../../Schema'

describe('Universes', () => {
  let graphql: GraphQL

  const {credentials} = OAuth2.init()

  beforeAll(async () => {
    const app = await App.init()

    graphql = new GraphQL(app)
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
            ownerProfileId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownerProfileId'] as const

    it('creates a new universe', async () => {
      const {token} = credentials
      const universe = UniverseFactory.makeCreateInput({
        // ownerProfileId: profile.id,
        ownerProfileId: faker.random.uuid(),
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

      // const created = await universes.findOne(data.createUniverse.universe?.id)

      // if (!created) {
      //   fail('No universe created.')
      // }

      // expect(created).toMatchObject({
      //   ...expected,
      //   id: data.createUniverse.universe?.id,
      // })

      // await universes.delete(created.id)
    })
  })
})

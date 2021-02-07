import {PrismaClient, Prisma} from '@prisma/client'
import {SelectionSetNode} from 'graphql'
import _ from 'lodash'
import {JsonObject} from 'type-fest'

let client: PrismaClient | undefined

export const init = (options?: Prisma.PrismaClientOptions) => {
  if (!client) {
    client = new PrismaClient(options)
  }

  return client
}

export const get = () => client

export const disconnect = async () => {
  if (client) {
    await client.$disconnect()
    client = undefined
  }
}

/**
 * Return an object indicating possibly nested relationships that should be included in a Prisma
 * query.
 */
const fromSelections = (
  selectionSet: SelectionSetNode,
  parent?: string
): JsonObject =>
  selectionSet.selections.reduce((memo, selection) => {
    if (selection.kind !== 'Field') {
      return memo
    }

    if (!selection.selectionSet) {
      return parent ? {...memo, [parent]: true} : memo
    }

    if (parent) {
      return {
        ...memo,
        [parent]: {
          include: fromSelections(selection.selectionSet, selection.name.value),
        },
      }
    }

    return {
      ...memo,
      ...fromSelections(selection.selectionSet, selection.name.value),
    }
  }, {})

/**
 * Given a GraphQL SelectionSetNode, a prefix, and a set of paths, derive the include statement for
 * Prisma.
 *
 * Example:
 *
 *     const [includeMyEntity, includeOtherEntity] = includeFromSelections(
 *       resolveInfo.operation.selectionSet,
 *       'myOperation.myField'
 *     )
 *
 */
export const includeFromSelections = (
  selectionSet: SelectionSetNode,
  path: string
) => _.get(fromSelections(selectionSet), path)

export default {init, get, disconnect}

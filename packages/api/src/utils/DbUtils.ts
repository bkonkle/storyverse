import {SelectionSetNode} from 'graphql'
import {get} from 'lodash'
import {JsonObject} from 'type-fest'

/**
 * Return an object indicating possibly nested relationships that should be included in a SQL query.
 */
export const fromSelections = (
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
 * Given a GraphQL SelectionSetNode, a prefix, and a set of paths, determine whether related data
 * should be loaded for each.
 *
 * Example:
 *
 *     const [includeMyEntity, includeOtherEntity] = includeFromSelections(
 *       resolveInfo.operation.selectionSet,
 *       'myOperation.myField',
 *       ['myEntity', 'relatedEntity.otherEntity']
 *     )
 *
 */
export const includeFromSelections = (
  selectionSet: SelectionSetNode,
  prefix: string,
  paths: string[]
): boolean[] => {
  const include = fromSelections(selectionSet)

  return paths.map(
    (path) => get(include, `${prefix}.${path}`) === true || false
  )
}

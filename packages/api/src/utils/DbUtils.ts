import {SelectionSetNode} from 'graphql'

type ValueOrTrue<T> = T | true
type Includes = {[key: string]: ValueOrTrue<Includes>}

export const includeFromSelections = (
  selectionSet: SelectionSetNode,
  parent?: string
) =>
  selectionSet.selections.reduce((memo, selection): Includes => {
    if (selection.kind !== 'Field') {
      return memo
    }

    if (!selection.selectionSet) {
      return parent ? {...memo, [parent]: true} : memo
    }

    if (parent) {
      return {
        ...memo,
        [parent]: includeFromSelections(
          selection.selectionSet,
          selection.name.value
        ),
      }
    }

    return {
      ...memo,
      ...includeFromSelections(selection.selectionSet, selection.name.value),
    }
  }, {} as Includes)

import camelcase from 'camelcase'
import {FindOneOptions} from 'typeorm'

export const fromOrderBy = <Entity, Order extends string>(
  orderBy?: Order[]
): FindOneOptions<Entity>['order'] =>
  orderBy?.reduce((memo, order) => {
    const index = order.lastIndexOf('_')
    const [field, direction] = [
      camelcase(order.substr(0, index)),
      order.substr(index + 1),
    ]

    return {...memo, [field]: direction}
  }, {})

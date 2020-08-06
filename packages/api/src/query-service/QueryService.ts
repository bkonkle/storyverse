import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindConditions,
} from 'typeorm'
import {plainToClass} from 'class-transformer'
import {ClassType} from 'class-transformer/ClassTransformer'

import {ManyResponse, paginateResponse} from './QueryPagination'

export interface QueryOptions<Entity> {
  where?: FindConditions<Entity>
  select?: (keyof Entity)[]
  order?: FindOneOptions<Entity>['order']
}

export interface ManyQueryOptions<Entity>
  extends Omit<QueryOptions<Entity>, 'where'> {
  where?: FindManyOptions<Entity>['where']
  pageSize?: number
  page?: number
}

export class QueryService<Entity> {
  constructor(protected repo: Repository<Entity>) {}

  classType = this.repo.target as ClassType<Entity>

  fromInput = (input: DeepPartial<Entity>): Entity =>
    input instanceof this.classType
      ? input
      : plainToClass(this.classType, input)

  async getOne(
    options: QueryOptions<Entity> = {}
  ): Promise<Entity | undefined> {
    const {where, order, select} = options

    return this.repo.findOne(where, {order, select})
  }

  async getMany(
    options: ManyQueryOptions<Entity> = {}
  ): Promise<ManyResponse<Entity>> {
    const {where, order, pageSize, page} = options

    const skip =
      (pageSize && page && page > 1 && (page - 1) * pageSize) || undefined

    const [data, total] = await this.repo.findAndCount({
      where,
      order,
      take: pageSize,
      skip,
    })

    return paginateResponse(data, {
      total,
      pageSize,
      page,
    })
  }

  async createOne(input: DeepPartial<Entity>): Promise<Entity | undefined> {
    if (typeof input !== 'object' || !Object.keys(input).length) {
      return undefined
    }

    return this.repo.save(this.fromInput(input))
  }
}

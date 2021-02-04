export interface QueryOptions<Entity> {
  where?: FindConditions<Entity>
  select?: (keyof Entity)[]
  order?: FindOneOptions<Entity>['order']
}

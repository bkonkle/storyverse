import {Query, Resolver, Args, ID, Int} from '@nestjs/graphql'

import {ManyResponse} from '../query-service/QueryPagination'
import Profile from './data/Profile'
import {ProfilesService} from './ProfilesService'

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private service: ProfilesService) {}

  @Query(() => Profile, {nullable: true})
  async profile(
    @Args('id', {type: () => ID}) id: string
  ): Promise<Profile | undefined> {
    return this.service.getOne({where: {id}})
  }

  @Query(() => Profile)
  async profiles(
    @Args('pageSize', {type: () => Int, nullable: true}) pageSize?: number,
    @Args('page', {type: () => Int, nullable: true}) page?: number
  ): Promise<ManyResponse<Profile>> {
    return this.service.getMany({pageSize, page})
  }
}

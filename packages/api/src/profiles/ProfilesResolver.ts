import {Query, Resolver, Args, ID} from '@nestjs/graphql'

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
}

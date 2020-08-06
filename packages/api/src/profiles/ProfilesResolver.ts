import {Query, Resolver, Args, ID} from '@nestjs/graphql'

import Profile from './data/Profile'

@Resolver(() => Profile)
export class ProfilesResolver {
  @Query(() => Profile, {nullable: true})
  async profile(
    @Args('id', {type: () => ID}) id: number
  ): Promise<Profile | undefined> {
    console.log(`>- id ->`, id)

    return
  }
}

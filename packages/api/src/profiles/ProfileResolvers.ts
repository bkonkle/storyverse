import {Resolver, Query, Args, Mutation} from '@nestjs/graphql'

import {Profile, ProfilesPage, MutateProfileResult} from '../Schema'
import {fromOrderBy} from '../lib/resolvers'
import ProfilesService from './ProfilesService'
import GetProfileArgs from './data/GetProfileArgs'
import GetManyProfilesArgs from './data/GetManyProfilesArgs'
import CreateProfileArgs from './data/CreateProfileArgs'
import UpdateProfileArgs from './data/UpdateProfileArgs'
import DeleteProfileArgs from './data/DeleteProfileArgs'

@Resolver('Profile')
export class ProfileResolvers {
  constructor(private readonly service: ProfilesService) {}

  @Query()
  async getProfile(@Args() args: GetProfileArgs): Promise<Profile | undefined> {
    const {id} = args

    return this.service.findOne({where: {id}})
  }

  @Query()
  async getManyProfiles(
    @Args() args: GetManyProfilesArgs
  ): Promise<ProfilesPage> {
    const {where, orderBy, pageSize, page} = args

    return this.service.find({
      where,
      order: fromOrderBy(orderBy),
      pageSize,
      page,
    })
  }

  @Mutation()
  async createProfile(
    @Args() args: CreateProfileArgs
  ): Promise<MutateProfileResult> {
    const {input} = args

    const profile = await this.service.create(input)

    return {profile}
  }

  @Mutation()
  async updateProfile(
    @Args() args: UpdateProfileArgs
  ): Promise<MutateProfileResult> {
    const {id, input} = args

    const profile = await this.service.update(id, input)

    return {profile}
  }

  @Mutation()
  async deleteProfile(
    @Args() args: DeleteProfileArgs
  ): Promise<MutateProfileResult> {
    const {id} = args

    await this.service.delete(id)

    return {}
  }
}

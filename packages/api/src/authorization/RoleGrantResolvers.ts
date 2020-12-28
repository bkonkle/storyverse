import {
  ForbiddenException,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import {Resolver, Args, Mutation} from '@nestjs/graphql'

import {CreateRoleGrantInput, MutateRoleGrantResult} from '../Schema'
import {JwtGuard} from '../lib/auth/JwtGuard'
import {UserSub} from '../lib/auth/JwtDecorators'
import ProfilesService from '../profiles/ProfilesService'
import RoleGrantsService from './RoleGrantsService'
import {GrantRoles, RevokeRoles} from './Roles'
import Profile from '../profiles/Profile.entity'

@Resolver('RoleGrant')
@UseGuards(JwtGuard)
export class RoleGrantResolvers {
  constructor(
    private readonly service: RoleGrantsService,
    private readonly profiles: ProfilesService
  ) {}

  /**
   * Grant a new Role to a User Profile.
   */
  @Mutation()
  async createRoleGrant(
    @Args('input') input: CreateRoleGrantInput,
    @UserSub({require: true}) username: string
  ): Promise<MutateRoleGrantResult> {
    const profile = await this.getProfile(username)
    await this.service.requirePermissions([GrantRoles], profile.id)

    const roleGrant = await this.service.create(input)

    return {roleGrant}
  }

  /**
   * Delete an existing RoleGrant.
   */
  @Mutation()
  async deleteRoleGrant(
    @Args('id', new ParseUUIDPipe()) id: string,
    @UserSub({require: true}) username: string
  ): Promise<MutateRoleGrantResult> {
    const profile = await this.getProfile(username)
    await this.service.requirePermissions([RevokeRoles], profile.id)

    const existing = await this.service.findOne({where: {id}})
    if (!existing) {
      throw new NotFoundException()
    }

    await this.service.delete(id)

    return {roleGrant: existing}
  }

  private async getProfile(username: string): Promise<Profile> {
    const profile = await this.profiles.getByUsername(username)

    if (!profile) {
      throw new ForbiddenException(
        'No Profile found for the currently logged in User'
      )
    }

    return profile
  }
}

export default RoleGrantResolvers

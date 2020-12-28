import {DeepPartial, Repository} from 'typeorm'
import {uniqBy} from 'lodash'
import {ForbiddenException, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'

import {TypeOrm} from '../lib/services'
import {Role, Permission} from './Roles'
import RoleGrant from './RoleGrant.entity'
import RolesService from './RolesService'

export interface Subject {
  table: string
  id: string
}

@Injectable()
export class RoleGrantsService {
  typeorm = TypeOrm.init(this.repo)

  constructor(
    @InjectRepository(RoleGrant) private readonly repo: Repository<RoleGrant>,
    private readonly roles: RolesService
  ) {}

  find = this.typeorm.find
  findOne = this.typeorm.findOne
  delete = this.typeorm.delete

  async create(input: DeepPartial<RoleGrant>) {
    if (!input.roleKey) {
      throw new Error("A 'roleKey' is required")
    }

    if (!this.roles.roleKeys().includes(input.roleKey)) {
      throw new Error(`Role ${input.roleKey} is not a registered Role`)
    }

    return this.typeorm.create(input)
  }

  async update(id: string, input: DeepPartial<RoleGrant>) {
    if (input.roleKey) {
      if (!this.roles.roleKeys().includes(input.roleKey)) {
        throw new Error(`Role ${input.roleKey} is not a registered Role`)
      }
    }

    return this.typeorm.update(id, input)
  }

  /**
   * Return an array of Roles granted for the given Profile id, optionally in the context of a
   * specific subject item.
   */
  async getRolesByProfile(
    profileId: string,
    subject?: Subject
  ): Promise<Role[]> {
    let query = this.repo
      .createQueryBuilder('role_grant')
      .where('role_grant.profile_id = :profileId', {profileId})

    if (subject) {
      query = query
        .andWhere('role_grant.subject_table = :table', {table: subject.table})
        .andWhere('role_grant.subject_id = :id', {id: subject.id})
    } else {
      query = query
        .andWhere('role_grant.subject_table IS NULL')
        .andWhere('role_grant.subject_id IS NULL')
    }

    const grants = await query.getMany()

    return grants.map(this.toRoles)
  }

  /**
   * Return an array of distinct Permissions granted via Roles for the given Profile id, optionally
   * in the context of a specific subject item.
   */
  async getPermissionsByProfile(
    profileId: string,
    subject?: Subject
  ): Promise<Permission[]> {
    const roles = await this.getRolesByProfile(profileId, subject)

    const permissions = roles.reduce(
      (memo, role) => memo.concat(role.permissions),
      [] as Permission[]
    )

    return uniqBy(permissions, (permission) => permission.key)
  }

  /**
   * Check for specific Permissions and return true if they were all found for the given Profile.
   */
  async hasPermissions(
    permissions: Permission[],
    profileId: string,
    subject?: Subject
  ): Promise<boolean> {
    const profilePerms = await this.getPermissionsByProfile(profileId, subject)
    const keys = profilePerms.map((permission) => permission.key)

    return permissions.every((permission) => keys.includes(permission.key))
  }

  /**
   * Check for specific Permissions and throw an error if they weren't all found for the given
   * Profile.
   */
  async requirePermissions(
    permissions: Permission[],
    profileId: string,
    subject?: Subject
  ): Promise<void> {
    const success = await this.hasPermissions(permissions, profileId, subject)

    if (!success) {
      throw new ForbiddenException()
    }
  }

  /**
   * Map RoleGrants to Role objects.
   */
  private toRoles(grant: RoleGrant): Role {
    const role = this.roles.roles.find((role) => role.key === grant.roleKey)

    if (!role) {
      throw new Error(
        `Unable to find a registered Role with key ${grant.roleKey}`
      )
    }

    return role
  }
}

export default RoleGrantsService

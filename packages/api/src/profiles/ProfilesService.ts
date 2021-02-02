import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'

import {TypeOrm} from '../lib/services'

import Profile from './Profile.entity'

@Injectable()
export default class ProfilesService {
  typeorm = TypeOrm.init(this.repo)

  constructor(
    @InjectRepository(Profile) private readonly repo: Repository<Profile>
  ) {}

  find = this.typeorm.find
  findOne = this.typeorm.findOne
  create = this.typeorm.create
  update = this.typeorm.update
  delete = this.typeorm.delete

  async getByUsername(username: string): Promise<Profile | undefined> {
    return this.repo
      .createQueryBuilder('profile')
      .innerJoin('users', 'user', '"profile"."user_id" = "user"."id"')
      .where('"user"."username" = :username', {username})
      .getOne()
  }
}

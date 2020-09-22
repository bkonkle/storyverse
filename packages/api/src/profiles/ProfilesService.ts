import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'

import {Typeorm} from '../lib/services'

import Profile from './Profile.entity'

@Injectable()
export class ProfilesService {
  typeorm = Typeorm.init(this.repo)

  constructor(
    @InjectRepository(Profile) private readonly repo: Repository<Profile>
  ) {}

  find = this.typeorm.find
  findOne = this.typeorm.findOne
  create = this.typeorm.create
  update = this.typeorm.update
  delete = this.typeorm.delete
}

export default ProfilesService

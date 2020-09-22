import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'

import {Typeorm} from '../lib/services'

import User from './User.entity'

@Injectable()
export class UsersService {
  typeorm = Typeorm.init(this.repo)

  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>
  ) {}

  find = this.typeorm.find
  findOne = this.typeorm.findOne
  create = this.typeorm.create
  update = this.typeorm.update
  delete = this.typeorm.delete
}

export default UsersService

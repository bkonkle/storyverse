import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'

import {Typeorm} from '../lib/services'

import Universe from './Universe.entity'

@Injectable()
export class UniversesService {
  typeorm = Typeorm.init(this.repo)

  constructor(
    @InjectRepository(Universe) private readonly repo: Repository<Universe>
  ) {}

  find = this.typeorm.find
  findOne = this.typeorm.findOne
  create = this.typeorm.create
  update = this.typeorm.update
  delete = this.typeorm.delete
}

export default UniversesService

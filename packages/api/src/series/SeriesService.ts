import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'

import {TypeOrm} from '../lib/services'

import Series from './Series.entity'

@Injectable()
export class SeriesService {
  typeorm = TypeOrm.init(this.repo)

  constructor(
    @InjectRepository(Series) private readonly repo: Repository<Series>
  ) {}

  find = this.typeorm.find
  findOne = this.typeorm.findOne
  create = this.typeorm.create
  update = this.typeorm.update
  delete = this.typeorm.delete
}

export default SeriesService

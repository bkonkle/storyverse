import {Repository} from 'typeorm'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'

import {QueryService} from '../query-service/QueryService'
import Profile from './data/Profile'

@Injectable()
export class ProfilesService extends QueryService<Profile> {
  constructor(@InjectRepository(Profile) repo: Repository<Profile>) {
    super(repo)
  }
}

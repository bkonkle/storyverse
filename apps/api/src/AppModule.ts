import * as fs from 'fs'
import {registry} from 'tsyringe'
import {PrismaClient} from '@prisma/client'

import {
  ConfigModule,
  ProcessEnv,
  Prisma,
  NodeFS,
  useRegistry,
} from '@storyverse/api/utils'

import UserModule from './users/UserModule'
import ProfileModule from './profiles/ProfileModule'
import UniverseModule from './universes/UniverseModule'
import SeriesModule from './series/SeriesModule'
import StoryModule from './stories/StoryModule'

@registry([
  useRegistry(UserModule),
  useRegistry(ProfileModule),
  useRegistry(UniverseModule),
  useRegistry(SeriesModule),
  useRegistry(StoryModule),
  useRegistry(ConfigModule),

  {token: ProcessEnv, useValue: process.env},
  {token: NodeFS, useValue: fs},
  {token: PrismaClient, useFactory: () => Prisma.init()},
])
export default class AppModule {}

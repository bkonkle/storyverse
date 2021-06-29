import * as fs from 'fs'
import Debug from 'debug'
import {registry} from 'tsyringe'
import {PrismaClient} from '@prisma/client'
import Redis from 'ioredis'

import {
  ConfigModule,
  ProcessEnv,
  Prisma,
  NodeFS,
  useRegistry,
  NodeDebug,
  IORedis,
  Config,
} from '@storyverse/api/utils'

import UserModule from './users/UserModule'
import ProfileModule from './profiles/ProfileModule'
import UniverseModule from './universes/UniverseModule'
import SeriesModule from './series/SeriesModule'
import StoryModule from './stories/StoryModule'
import SocketModule from './socket/SocketModule'

@registry([
  useRegistry(UserModule),
  useRegistry(ProfileModule),
  useRegistry(UniverseModule),
  useRegistry(SeriesModule),
  useRegistry(StoryModule),
  useRegistry(ConfigModule),
  useRegistry(SocketModule),

  {token: ProcessEnv, useValue: process.env},

  {token: NodeFS, useValue: fs},

  {token: PrismaClient, useFactory: () => Prisma.init()},

  {
    token: IORedis,
    useFactory: (c) => {
      const config = c.resolve(Config)
      const {
        redis: {url},
      } = config.getProperties()

      return new Redis(url)
    },
  },

  {token: NodeDebug, useValue: Debug},
])
export default class AppModule {}

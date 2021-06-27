import * as fs from 'fs'
import {registry} from 'tsyringe'
import {PrismaClient} from '@prisma/client'

import {
  ConfigRegistry,
  ProcessEnv,
  Prisma,
  NodeFS,
  useRegistry,
} from '@storyverse/api/utils'

import UserRegistry from './users/UserRegistry'
import ProfileRegistry from './profiles/ProfileRegistry'
import UniverseRegistry from './universes/UniverseRegistry'
import SeriesRegistry from './series/SeriesRegistry'
import StoryRegistry from './stories/StoryRegistry'

@registry([
  useRegistry(UserRegistry),
  useRegistry(ProfileRegistry),
  useRegistry(UniverseRegistry),
  useRegistry(SeriesRegistry),
  useRegistry(StoryRegistry),
  useRegistry(ConfigRegistry),

  {token: ProcessEnv, useValue: process.env},
  {token: NodeFS, useValue: fs},
  {token: PrismaClient, useFactory: () => Prisma.init()},
])
export default class AppRegistry {}

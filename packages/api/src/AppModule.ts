import {join} from 'path'
import {Module, HttpModule, Logger} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ScheduleModule} from '@nestjs/schedule'
import {GraphQLModule} from '@nestjs/graphql'

import {Vars, getVar} from './config/Environment'
import Database from './config/Database'
import ConfigModule from './config/ConfigModule'
import HealthModule from './health/HealthModule'
import {AuthnModule} from './auth/AuthnModule'
import UsersModule from './users/UsersModule'
import ProfilesModule from './profiles/ProfilesModule'
import UniversesModule from './universes/UniversesModule'

const env = getVar(Vars.NodeEnv) || 'production'
const isDev = env === 'development'
const isProd = env === 'production'

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    AuthnModule,
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(Database),
    GraphQLModule.forRoot({
      debug: isDev,
      playground: !isProd,
      typePaths: ['./**/*.graphql'],
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    UsersModule,
    ProfilesModule,
    UniversesModule,
  ],
  providers: [Logger],
})
export class AppModule {}

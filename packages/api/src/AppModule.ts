import {join} from 'path'
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  HttpModule,
  Logger,
} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ScheduleModule} from '@nestjs/schedule'
import {GraphQLModule} from '@nestjs/graphql'

import {getEnv, EnvKeys} from './config/Environment'
import Database from './config/Database'
import ConfigModule from './config/ConfigModule'
import HealthModule from './health/HealthModule'
import DecoderMiddleware from './jwt/DecoderMiddleware'
import UsersModule from './users/UsersModule'
import ProfilesModule from './profiles/ProfilesModule'
import UniversesModule from './universes/UniversesModule'

const env = getEnv(EnvKeys.NodeEnv, 'production')
const isDev = env === 'development'
const isProd = env === 'production'

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(Database),
    GraphQLModule.forRoot({
      debug: isDev,
      playground: !isProd,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    UsersModule,
    ProfilesModule,
    UniversesModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(DecoderMiddleware)
      .forRoutes({path: '*', method: RequestMethod.ALL})
  }
}

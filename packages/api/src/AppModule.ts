import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ScheduleModule} from '@nestjs/schedule'
import {GraphQLModule} from '@nestjs/graphql'

import {Database} from './config'
import {ConfigModule} from './config'
import {HealthModule} from './health'
import {DecoderMiddleware} from './jwt'
import {getEnv, EnvKeys} from './config/Environment'
import {UsersModule} from './users'

const env = getEnv(EnvKeys.NodeEnv, 'production')
const isDev = env === 'development'
const isProd = env === 'production'

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(Database),
    GraphQLModule.forRoot({
      debug: isDev,
      playground: !isProd,
    }),
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(DecoderMiddleware)
      .forRoutes({path: '*', method: RequestMethod.ALL})
  }
}

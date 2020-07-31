import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ScheduleModule} from '@nestjs/schedule'

import {Database} from './config'
import {ConfigModule} from './config'
import {HealthModule} from './health'
import {DecoderMiddleware} from './jwt'

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(Database),
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(DecoderMiddleware)
      .forRoutes({path: '*', method: RequestMethod.ALL})
  }
}

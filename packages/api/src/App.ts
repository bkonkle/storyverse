import bodyParser from 'body-parser'
import {NestFactory} from '@nestjs/core'
import {INestApplication, ValidationPipe} from '@nestjs/common'

import ConfigService from './config/ConfigService'
import {Vars} from './config/Environment'
import {AppModule} from './AppModule'

export async function init(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule)

  const config = app.get(ConfigService)
  const environment = config.getVar(Vars.NodeEnv) || 'production'
  const isDev = environment === 'development'

  app.use(bodyParser.json({limit: '50mb'}))
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({disableErrorMessages: !isDev}))

  return app
}

async function bootstrap(): Promise<void> {
  const app = await init()

  const config = app.get(ConfigService)
  const port = config.getVar(Vars.Port) || '3000'

  app.startAllMicroservices()

  await app.listen(Number(port))
}

bootstrap()

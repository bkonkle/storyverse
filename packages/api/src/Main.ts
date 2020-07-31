import axios, {AxiosError, AxiosInstance} from 'axios'
import httpContext from 'express-http-context'
import bodyParser from 'body-parser'
import {NestFactory} from '@nestjs/core'
import {
  INestApplication,
  ValidationPipe,
  Logger,
  LoggerService,
} from '@nestjs/common'
import {AXIOS_INSTANCE_TOKEN} from '@nestjs/common/http/http.constants'

import {ConfigService, Environment} from './config'
import {AppModule} from './AppModule'

const {EnvKeys} = Environment

export async function init(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule)

  const logger = app.get<LoggerService>(Logger)

  app.use(bodyParser({limit: '50mb'}))
  app.useGlobalPipes(new ValidationPipe())

  app.use(httpContext.middleware)

  const nestAxiosInstance = app.get<AxiosInstance>(AXIOS_INSTANCE_TOKEN)

  ;[axios, nestAxiosInstance].forEach((a) => {
    a.interceptors.response.use(
      (response) => response,

      (error: AxiosError) => {
        logger.error({
          message: 'Axios Error',
          error,
          context: {
            message: error.response?.data.message,
            status: error.response?.data.statusCode,
            url: error.config.url,
          },
        })

        return Promise.reject(error)
      }
    )
    a.interceptors.request.use((request) => {
      const headersToForward = ['x-request-id']

      headersToForward.forEach((header) => {
        if (httpContext.get(header)) {
          request.headers[header] = httpContext.get(header)
        }
      })

      return request
    })
  })

  return app
}

async function bootstrap(): Promise<void> {
  const app = await init()
  const config = app.get(ConfigService)

  app.startAllMicroservices()

  const port = Number(config.get(EnvKeys.Port, '3000'))

  await app.listen(port)
}

bootstrap()

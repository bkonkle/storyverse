import {PrismaClient, Prisma} from '@prisma/client'

let client: PrismaClient | undefined

export const init = (options?: Prisma.PrismaClientOptions) => {
  if (!client) {
    client = new PrismaClient(options)
  }

  return client
}

export const get = () => client

export const disconnect = async () => {
  if (client) {
    await client.$disconnect()
    client = undefined
  }
}

export default {init, get, disconnect}

import {PrismaClient} from '@prisma/client'

export default class UsersService {
  private readonly prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient()
  }

  findFirst: PrismaClient['user']['findFirst'] = (args) =>
    this.prisma.user.findFirst(args)

  create: PrismaClient['user']['create'] = (args) =>
    this.prisma.user.create(args)

  update: PrismaClient['user']['update'] = (args) =>
    this.prisma.user.update(args)
}

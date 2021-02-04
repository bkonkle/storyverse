import {PrismaClient} from '@prisma/client'

import {CreateProfileInput} from '../Schema'

export default class ProfilesService {
  private readonly prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient()
  }

  findFirst: PrismaClient['profile']['findFirst'] = (args) =>
    this.prisma.profile.findFirst(args)

  createProfile = async (input: CreateProfileInput) => {
    return this.prisma.profile.create({
      include: {
        user: true,
      },
      data: {
        ...input,
        userId: undefined,
        user: {
          connect: {id: input.userId},
        },
      },
    })
  }
}

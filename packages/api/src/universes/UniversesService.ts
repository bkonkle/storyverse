import {PrismaClient} from '@prisma/client'

import {CreateUniverseInput, Universe} from '../Schema'

export default class UniversesService {
  private readonly prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient()
  }

  createUniverse = async (input: CreateUniverseInput): Promise<Universe> => {
    return this.prisma.universe.create({
      include: {
        ownerProfile: true,
      },
      data: {
        ...input,
        ownerProfileId: undefined,
        ownerProfile: {
          connect: {id: input.ownerProfileId},
        },
      },
    })
  }
}

import {Message} from '@prisma/client'

export type MessageEvent = Message & {
  profile: {
    id: string
    displayName: string | null
    picture: string | null
  }
}

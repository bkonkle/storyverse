import * as z from 'zod'

export namespace Universe {
  /**
   * The client-side schema for the Universe.description field.
   */
  export interface Description {
    // For compatibility with Prisma.JsonValue
    [key: string]: string | undefined
    quill?: string
  }

  export const description = (): z.ZodSchema<Description> =>
    z.object({
      text: z.string().optional(),
    })
}

export namespace Series {
  /**
   * The client-side schema for the Series.description field.
   */
  export interface Description {
    // For compatibility with Prisma.JsonValue
    [key: string]: string | undefined
    text?: string
  }

  export const description = (): z.ZodSchema<Description> =>
    z.object({
      text: z.string().optional(),
    })
}

export namespace Story {
  /**
   * The client-side schema for the Story.summary field.
   */
  export interface Summary {
    // For compatibility with Prisma.JsonValue
    [key: string]: string | undefined
    text?: string
  }

  export const summary = (): z.ZodSchema<Summary> =>
    z.object({
      text: z.string().optional(),
    })

  /**
   * The client-side schema for the Story.summary field.
   */
  export interface Content {
    // For compatibility with Prisma.JsonValue
    [key: string]: string | undefined
    text?: string
  }

  export const content = (): z.ZodSchema<Content> =>
    z.object({
      text: z.string().optional(),
    })
}

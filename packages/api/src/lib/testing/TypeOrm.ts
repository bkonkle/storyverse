import {Connection} from 'typeorm'

export type Utils = ReturnType<typeof init>

export const init = (db: Connection) => ({
  dbCleaner: async (tables: string[]) =>
    Promise.all(
      tables.map((table) => db.query(`TRUNCATE TABLE "${table}" CASCADE;`))
    ),
})

export default {init}

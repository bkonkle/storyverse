import {execSync} from 'child_process'

import config from '../knexfile'

const main = async () => {
  const sqlFile = process.argv[2]
  const {connection, name} = config

  if (!sqlFile) throw new Error('No filename was provided to restore from.')

  console.log(new Date(), `Beginning ${name} database restore...`)

  execSync(
    `PGPASSWORD=${connection.password} dropdb --if-exists -h ${connection.host} -p ${connection.port} -U ${connection.user} ${connection.database}`,
    {stdio: 'inherit'}
  )

  execSync(
    `PGPASSWORD=${connection.password} createdb -h ${connection.host} -p ${connection.port} -U ${connection.user} ${connection.database} -O ${connection.user}`,
    {stdio: 'inherit'}
  )

  try {
    execSync(
      `PGPASSWORD=${connection.password} pg_restore -Fc ${sqlFile} -d ${connection.database} -h ${connection.host} -p ${connection.port} -U ${connection.user}`,
      {stdio: 'inherit'}
    )
  } catch (_err) {
    // Skip errors here because of the "must be owner of extension uuid-ossp" issue
  }

  console.log(new Date(), `${name} database restore complete!`)
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)

    process.exit(1)
  })
}

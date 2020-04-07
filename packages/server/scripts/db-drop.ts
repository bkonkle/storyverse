import {execSync} from 'child_process'

import config from '../knexfile'

export const main = async () => {
  const {connection} = config

  console.log(new Date(), `Dropping database ${connection.database}...`)

  execSync(
    `PGPASSWORD=${connection.password} dropdb --if-exists -h ${connection.host} -p ${connection.port} -U ${connection.user} ${connection.database}`,
    {stdio: ['inherit', 'pipe', 'inherit']}
  )
}

if (require.main === module) {
  main()
    .catch(console.error) // tslint:disable-line:no-console
    .finally(process.exit)
}

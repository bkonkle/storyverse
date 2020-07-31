import {execSync} from 'child_process'

import {Database} from '../../src/config'

export const main = async () => {
  console.log(new Date(), `Dropping database ${Database.database}...`)

  execSync(
    `PGPASSWORD=${Database.password} dropdb --if-exists -h ${Database.host} -p ${Database.port} -U ${Database.username} ${Database.database}`,
    {stdio: ['inherit', 'pipe', 'inherit']}
  )
}

if (require.main === module) {
  main()
    .catch(console.error) // tslint:disable-line:no-console
    .finally(process.exit)
}

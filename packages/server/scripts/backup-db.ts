import {execSync} from 'child_process'

import config from '../knexfile'

export const slugify = (text: string) =>
  text
    .toString()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '-') // Replace all non-word chars with -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

const main = async () => {
  const environment = process.env.ENVIRONMENT || 'local'
  const timestamp = slugify(new Date().toISOString())
  const {connection} = config

  console.log(
    new Date(),
    `Beginning ${environment.toUpperCase()} database backup...`
  )

  const sqlFile = process.argv[2] || `${environment}.${timestamp}.bak`

  execSync(
    `PGPASSWORD=${connection.password} pg_dump -Fc -f ${sqlFile} -d ${connection.database} -h ${connection.host} -p ${connection.port} -U ${connection.user}`,
    {stdio: 'inherit'}
  )

  console.log(
    new Date(),
    `${environment.toUpperCase()} database backup complete!`
  )
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)

    process.exit(1)
  })
}
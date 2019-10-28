import readdir from 'recursive-readdir'
import path from 'path'
import {execSync} from 'child_process'

import config from '../knexfile'

export const main = async () => {
  console.log(new Date(), `Refreshing DB functions...`)

  const {connection} = config

  // Find all SQL files in the `src` folder
  const files = (await readdir(path.join(__dirname, '..', 'src'))).filter(
    filename => filename.endsWith('.sql')
  )

  files.forEach(filename => {
    console.log(new Date(), `Loading ${path.basename(filename)}...`)

    execSync(
      `PGPASSWORD=${connection.password} psql -h ${connection.host} -p ${connection.port} -U ${connection.user} -d ${connection.database} -f ${filename}`,
      {stdio: ['inherit', 'pipe', 'inherit']}
    )
  })

  // Workaround - GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO storyverse_user;
  execSync(
    `PGPASSWORD=${connection.password} psql -h ${connection.host} -p ${connection.port} -U ${connection.user} -d ${connection.database} -c "GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO storyverse_user;"`,
    {stdio: ['inherit', 'pipe', 'inherit']}
  )
}

if (require.main === module) {
  main()
    .then(() => {
      process.exit(0)
    })
    .catch(err => {
      console.error(err)

      process.exit(1)
    })
}

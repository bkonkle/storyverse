import {execSync} from 'child_process'

import Database from '../../config/Database'
import * as Environment from '../../config/Environment'

const {Vars, getVars} = Environment

const main = async () => {
  const [port = '1701', key, bastion] = getVars([
    Vars.Port,
    Vars.SshKeyPath,
    Vars.BastionHost,
  ])

  if (!bastion) {
    throw new Error(
      `Unable to locate a bastion server for ${Database.database}`
    )
  }

  console.log(
    new Date(),
    `Opening SSH tunnel to ${Database.database} database...`
  )

  execSync(
    `ssh -i ${key} -N -L ${port}:${Database.host}:${Database.port} ec2-user@${bastion}`,
    {stdio: 'inherit'}
  )
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err)

    process.exit(1)
  })
}

import {execSync} from 'child_process'

import config from '../knexfile'

const ec2Map = {
  dev: process.env.DEV_BASTION_HOST,
}

const main = async () => {
  const {connection} = config

  const environment = process.env.ENVIRONMENT
  const port = process.env.PORT || 1701
  const key = process.env.SSH_KEY_PATH
  const bastion = ec2Map[environment]

  if (!bastion) {
    throw new Error(
      `Unable to local a bastion server for ${environment.toUpperCase()}`
    )
  }

  console.log(
    new Date(),
    `Opening SSH tunnel to ${environment.toUpperCase()} database...`
  )

  execSync(
    `ssh -i ${key} -N -L ${port}:${connection.host}:${connection.port} ec2-user@${bastion}`,
    {stdio: 'inherit'}
  )
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)

    process.exit(1)
  })
}

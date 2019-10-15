import {execSync} from 'child_process'

import * as Config from '../src/Config'

const main = async () => {
  console.log('Running the test server...\n')

  execSync('yarn dev.run', {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '4001',
      DATABASE_NAME: `${Config.Database.database}_test`,
    },
  })
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)

    process.exit(1)
  })
}

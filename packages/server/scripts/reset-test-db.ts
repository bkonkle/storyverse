import * as Utils from '../integration/Utils'

const main = async () => {
  console.log('Setting up the test database...\n')

  try {
    await Utils.initTestDb()
  } catch (err) {
    console.log('❌ Test database setup failed!\n')
    console.error(err)
    console.log('')

    process.exit(1)
  }

  console.log('✔ Test database setup complete!\n')
}

if (require.main === module) {
  main().catch(err => {
    console.error(err)

    process.exit(1)
  })
}

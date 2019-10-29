import {Constants} from 'expo'

const Config = {
  local: {
    Env: {
      isDev: true,
    },

    Api: {
      endpoint: 'http://localhost:8000/graphql',
    },
  },
  dev: {
    Env: {
      isDev: false,
    },

    Api: {
      endpoint: 'https://storyverse-dev-api.konkle.us/graphql',
    },
  },
  prod: {
    Env: {
      isDev: false,
    },

    Api: {
      endpoint: 'https://storyverse-prod-api.konkle.us/graphql',
    },
  },
}

function getConfig() {
  switch (Constants.manifest.releaseChannel) {
    case 'dev':
      return Config.dev
    case 'prod':
      return Config.prod
    default:
      return Config.local
  }
}

export default getConfig()

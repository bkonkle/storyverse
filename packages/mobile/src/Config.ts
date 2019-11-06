import Constants from 'expo-constants'

const Config = {
  local: {
    Env: {
      isDev: true,
    },

    Api: {
      endpoint: 'http://localhost:8000/graphql',
    },

    Auth: {
      clientId: 'vfhJeW5WSu4Rbc5b6SUJ4t0ICp62361o',
      domain: 'https://storyverse-dev.auth0.com',
      audience: 'localhost',
    },
  },
  dev: {
    Env: {
      isDev: false,
    },

    Api: {
      endpoint: 'https://storyverse-dev-api.konkle.us/graphql',
    },

    Auth: {
      clientId: 'vfhJeW5WSu4Rbc5b6SUJ4t0ICp62361o',
      domain: 'https://storyverse-dev.auth0.com',
      audience: 'dev',
    },
  },
  prod: {
    Env: {
      isDev: false,
    },

    Api: {
      endpoint: 'https://storyverse-prod-api.konkle.us/graphql',
    },

    Auth: {
      clientId: 'FIXME',
      domain: 'https://storyverse.auth0.com',
      audience: 'prod',
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

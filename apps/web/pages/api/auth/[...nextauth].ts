import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Auth0({
      authorizationUrl: `https://${process.env.OAUTH2_DOMAIN}/authorize?response_type=code&audience=localhost`,
      clientId: process.env.OAUTH2_CLIENT_ID || '',
      clientSecret: process.env.OAUTH2_CLIENT_SECRET || '',
      domain: process.env.OAUTH2_DOMAIN || '',
      idToken: true,
    }),
  ],
})

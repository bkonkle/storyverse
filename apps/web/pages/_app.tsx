import React from 'react'
import {AppProps} from 'next/app'
import {UserProvider} from '@auth0/nextjs-auth0'
import 'tailwindcss/tailwind.css'

export const NextApp = ({Component, pageProps}: AppProps) => {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default NextApp

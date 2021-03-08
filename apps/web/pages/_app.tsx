import React from 'react'
import {AppProps} from 'next/app'
import 'tailwindcss/tailwind.css'
import {Provider} from 'next-auth/client'

export const NextApp = ({Component, pageProps}: AppProps) => {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default NextApp

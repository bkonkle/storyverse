import React from 'react'
import {AppProps} from 'next/app'
import Head from 'next/head'
import {Provider} from 'next-auth/client'
import 'tailwindcss/tailwind.css'

export default function NextApp({Component, pageProps}: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Storyverse</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  )
}

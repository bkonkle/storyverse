import Head from 'next/head'
import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'next/router'
import {AppProps} from 'next/app'
import {Provider} from 'next-auth/client'

import {PageChange} from '@storyverse/web/components'

import 'tailwindcss/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '../public/assets/styles/base.css'
import '../public/assets/styles/quill-editor.css'

Router.events.on('routeChangeStart', (url: string) => {
  console.log(`Loading: ${url}`)
  document.body.classList.add('body-page-transition')
  ReactDOM.render(<PageChange />, document.getElementById('page-transition'))
})

Router.events.on('routeChangeComplete', () => {
  const element = document.getElementById('page-transition')
  element && ReactDOM.unmountComponentAtNode(element)
  document.body.classList.remove('body-page-transition')
})

Router.events.on('routeChangeError', () => {
  const element = document.getElementById('page-transition')
  element && ReactDOM.unmountComponentAtNode(element)
  document.body.classList.remove('body-page-transition')
})

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

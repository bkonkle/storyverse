import React from 'react'
import {AppProps} from 'next/app'
import 'tailwindcss/tailwind.css'

export const NextApp = ({Component, pageProps}: AppProps) => {
  return <Component {...pageProps} />
}

export default NextApp

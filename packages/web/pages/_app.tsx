import React from 'react'
import {AppProps} from 'next/app'
import 'tailwindcss/tailwind.css'

export const App = ({Component, pageProps}: AppProps) => {
  return <Component {...pageProps} />
}

export default App

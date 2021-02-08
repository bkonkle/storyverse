import React from 'react'
import Head from 'next/head'

import {siteTitle} from '../components/Layout'

export const Home = () => {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section></section>
    </>
  )
}

export default Home

import React from 'react'
import Head from 'next/head'

import Layout, {siteTitle} from '../components/Layout'

export const Home = () => {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>Welcome to Storyverse!</section>
    </Layout>
  )
}

export default Home

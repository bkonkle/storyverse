import React from 'react'
import Head from 'next/head'

import App from '../components/App'
import Home from '../components/home/Home'
import {Pages} from '../components/nav/NavLinks'
import {Page} from '../components/Styles'

export const getClasses = () => Page.pageHeader

export const HomePage = () => {
  const classes = getClasses()

  return (
    <App requireUser currentPage={Pages.Home}>
      <Head>
        <title>Storyverse - Home</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>Home</h1>
        </div>
      </header>
      <main>
        <div className={classes.pageContainer}>
          <div className={classes.page}>
            <Home />
          </div>
        </div>
      </main>
    </App>
  )
}

export default HomePage

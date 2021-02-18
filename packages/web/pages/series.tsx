import React from 'react'
import Head from 'next/head'

import App from '../components/App'
import Series from '../components/series/Series'
import {Pages} from '../components/nav/NavLinks'
import {Page} from '../components/Styles'

export const getClasses = () => Page.pageHeader

export const SeriesPage = () => {
  const classes = getClasses()

  return (
    <App requireUser currentPage={Pages.Series}>
      <Head>
        <title>Storyverse - Series</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>Series</h1>
        </div>
      </header>
      <main>
        <div className={classes.pageContainer}>
          <div className={classes.page}>
            <Series />
          </div>
        </div>
      </main>
    </App>
  )
}

export default SeriesPage

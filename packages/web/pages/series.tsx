import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../components/App'
import Series from '../components/series/Series'
import {Page} from '../components/Styles'
import {Pages, useStore} from '../data/Store'

export const getClasses = () => Page.pageHeader

export const SeriesPage = () => {
  const classes = getClasses()
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Series)
  })

  return (
    <App requireUser>
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

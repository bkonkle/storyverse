import React from 'react'
import Head from 'next/head'

import App from '../components/App'
import Universes from '../components/universes/Universes'
import {Pages} from '../components/nav/NavLinks'
import {Page} from '../components/Styles'

export const getClasses = () => Page.pageHeader

export const UniversesPage = () => {
  const classes = getClasses()

  return (
    <App requireUser currentPage={Pages.Universes}>
      <Head>
        <title>Storyverse - Universes</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>Universes</h1>
        </div>
      </header>
      <main>
        <div className={classes.pageContainer}>
          <div className={classes.page}>
            <Universes />
          </div>
        </div>
      </main>
    </App>
  )
}

export default UniversesPage

import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../components/App'
import Universes from '../components/universes/Universes'
import {Page} from '../components/Styles'
import {Pages, useStore} from '../data/Store'

export const getClasses = () => Page.pageHeader

export const UniversesPage = () => {
  const classes = getClasses()
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Universes)
  })

  return (
    <App requireUser>
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

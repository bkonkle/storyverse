import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../components/App'
import Home from '../components/home/Home'
import {Page} from '../components/Styles'
import {Pages, useStore} from '../data/Store'

export const getClasses = () => Page.pageHeader

export const HomePage = () => {
  const classes = getClasses()
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Home)
  }, [])

  return (
    <App requireUser>
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

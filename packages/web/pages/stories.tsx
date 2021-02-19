import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../components/App'
import Stories from '../components/stories/Stories'
import {Page} from '../components/Styles'
import {Pages, useStore} from '../data/Store'

export const getClasses = () => Page.pageHeader

export const StoriesPage = () => {
  const classes = getClasses()
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Stories)
  }, [])

  return (
    <App requireUser>
      <Head>
        <title>Storyverse - Stories</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>Stories</h1>
        </div>
      </header>
      <main>
        <div className={classes.pageContainer}>
          <div className={classes.page}>
            <Stories />
          </div>
        </div>
      </main>
    </App>
  )
}

export default StoriesPage

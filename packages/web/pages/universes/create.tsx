import React, {useEffect} from 'react'
import Head from 'next/head'

import App from '../../components/App'
import {Page} from '../../components/Styles'
import {Pages, useStore} from '../../data/Store'

export const getClasses = () => Page.pageHeader

export const CreateUniversePage = () => {
  const classes = getClasses()
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Universes)
  }, [])

  return (
    <App requireUser>
      <Head>
        <title>Storyverse - Create Universe</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>Create a Universe</h1>
        </div>
      </header>
      <main>
        <div className={classes.pageContainer}>
          <div className={classes.page}></div>
        </div>
      </main>
    </App>
  )
}

export default CreateUniversePage

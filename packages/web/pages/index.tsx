import React, {useEffect} from 'react'
import clsx from 'clsx'
import Head from 'next/head'

import App from '../components/App'
import {useStore} from '../data/Store'

export const getClasses = () => {
  return {
    header: clsx('bg-white', 'shadow'),

    titleContainer: clsx(
      'max-w-7xl',
      'mx-auto',
      'py-6',
      'px-4',
      'sm:px-6',
      'lg:px-8'
    ),

    title: clsx('text-3xl', 'font-bold', 'leading-tight', 'text-gray-900'),

    pageContainer: clsx('max-w-7xl', 'mx-auto', 'py-6', 'sm:px-6', 'lg:px-8'),

    page: clsx('px-4', 'py-6', 'sm:px-0'),

    pageContent: clsx(
      'border-4',
      'border-dashed',
      'border-gray-200',
      'rounded-lg',
      'h-96'
    ),
  }
}

export const Index = () => {
  const classes = getClasses()
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(null)
  }, [])

  return (
    <App>
      <Head>
        <title>Storyverse</title>
      </Head>
      <header className={classes.header}>
        <div className={classes.titleContainer}>
          <h1 className={classes.title}>Welcome to Storyverse!</h1>
        </div>
      </header>
      <main>
        <div className={classes.pageContainer}>
          <div className={classes.page}>
            <div className={classes.pageContent}></div>
          </div>
        </div>
      </main>
    </App>
  )
}

export default Index

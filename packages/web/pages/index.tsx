import React, {useEffect} from 'react'
import clsx from 'clsx'
import Head from 'next/head'

import App from '../components/App'
import {useStore} from '../data/Store'

export const Index = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(null)
  }, [])

  return (
    <App>
      <Head>
        <title>Storyverse</title>
      </Head>
      <header className={clsx('bg-white', 'shadow')}>
        <div
          className={clsx(
            'max-w-7xl',
            'mx-auto',
            'py-6',
            'px-4',
            'sm:px-6',
            'lg:px-8'
          )}
        >
          <h1
            className={clsx(
              'text-3xl',
              'font-bold',
              'leading-tight',
              'text-gray-900'
            )}
          >
            Welcome to Storyverse!
          </h1>
        </div>
      </header>
      <main>
        <div
          className={clsx('max-w-7xl', 'mx-auto', 'py-6', 'sm:px-6', 'lg:px-8')}
        >
          <div className={clsx('px-4', 'py-6', 'sm:px-0')}>
            <div
              className={clsx(
                'border-4',
                'border-dashed',
                'border-gray-200',
                'rounded-lg',
                'h-96'
              )}
            ></div>
          </div>
        </div>
      </main>
    </App>
  )
}

export default Index

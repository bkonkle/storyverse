import React, {useEffect} from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import {withUrqlClient} from 'next-urql'

import Deprecated from '../components/layouts/Deprecated'
import {useStore} from '@storyverse/shared/data/Store'
import {api} from '@storyverse/shared/data/ApiClient'

export const Index = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(null)
  }, [setPage])

  return (
    <Deprecated>
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
    </Deprecated>
  )
}

export default withUrqlClient(api, {ssr: true})(Index)

import {useEffect} from 'react'
import {withUrqlClient} from 'next-urql'

import {api} from '@storyverse/graphql/ApiClient'
import {Pages, useStore} from '@storyverse/graphql/Store'

export const HomePage = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Home)
  }, [setPage])

  return null
}

export default withUrqlClient(api, {ssr: true})(HomePage)

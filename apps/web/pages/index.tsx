import {useEffect} from 'react'
import {withUrqlClient} from 'next-urql'

import {api} from '@storyverse/graphql/ApiClient'
import {useStore} from '@storyverse/graphql/Store'

export const Index = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(null)
  }, [setPage])

  return null
}

export default withUrqlClient(api, {ssr: true})(Index)

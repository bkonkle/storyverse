import {useEffect} from 'react'
import {withUrqlClient} from 'next-urql'

import {useStore} from '@storyverse/graphql/Store'
import {api} from '@storyverse/graphql/ApiClient'

export const Index = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(null)
  }, [setPage])

  return null
}

export default withUrqlClient(api, {ssr: true})(Index)

import {MouseEventHandler, useEffect} from 'react'
import {withUrqlClient} from 'next-urql'
import {signIn} from 'next-auth/client'

import {api} from '@storyverse/graphql/ApiClient'
import {Pages, useStore} from '@storyverse/graphql/Store'

export const handleLogin: MouseEventHandler<HTMLButtonElement> = (event) => {
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()

  signIn('auth0')
}

export const Index = () => {
  const {setPage} = useStore((state) => state.pages)

  useEffect(() => {
    setPage(Pages.Home)
  }, [setPage])

  return (
    <button className="m-4" onClick={handleLogin}>
      Login
    </button>
  )
}

export default withUrqlClient(api, {ssr: true})(Index)

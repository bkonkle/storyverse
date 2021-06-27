import {MouseEventHandler} from 'react'
import {signOut} from 'next-auth/client'

export const handleLogout: MouseEventHandler<HTMLAnchorElement> = (event) => {
  event.stopPropagation()
  event.nativeEvent.stopImmediatePropagation()

  signOut()
}

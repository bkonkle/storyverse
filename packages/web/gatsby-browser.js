import React, {useEffect, useState} from 'react'
import {silentAuth} from './src/data/AuthClient'

const SessionCheck = ({children}) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    silentAuth(() => setLoading(false))
  }, [])

  return loading === false && <>{children}</>
}

export const wrapRootElement = ({element}) => (
  <SessionCheck>{element}</SessionCheck>
)

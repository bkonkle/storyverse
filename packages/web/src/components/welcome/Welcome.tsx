import React, {FC} from 'react'
import {RouteComponentProps} from '@reach/router'

import SEO from '../Seo'

export const Welcome: FC<RouteComponentProps> = () => (
  <>
    <SEO title="Welcome" />
    <h1>Hi from the App!</h1>
    <p>Welcome to the App!</p>
  </>
)

export default Welcome

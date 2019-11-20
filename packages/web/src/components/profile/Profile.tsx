import React, {FC} from 'react'
import {RouteComponentProps} from '@reach/router'
import Typography from '@material-ui/core/Typography'

import SEO from '../Seo'

export const Profile: FC<RouteComponentProps> = () => (
  <>
    <SEO title="Profile" />
    <Typography variant="overline">Your Profile</Typography>
  </>
)

export default Profile

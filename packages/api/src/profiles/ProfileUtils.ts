import {omit} from 'lodash'

import Profile from './Profile.entity'

export const censorAnonymous = (
  profile?: Profile,
  isAuthenticated?: boolean
) => {
  if (!profile) {
    return
  }

  return isAuthenticated ? profile : omit(profile, ['email', 'userId', 'user'])
}

import {ForbiddenError, UserInputError} from 'apollo-server-core'

import {Profile} from '../Schema'
import ProfilesService from '../profiles/ProfilesService'

export default class UniverseAuthz {
  private readonly profiles: ProfilesService

  constructor(profiles?: ProfilesService) {
    this.profiles = profiles || new ProfilesService()
  }

  create = async (
    username: string,
    ownerProfileId: string
  ): Promise<Profile> => {
    const profile = await this.profiles.findFirst({
      include: {
        user: true,
      },
      where: {id: ownerProfileId},
    })

    if (!profile) {
      throw new UserInputError(
        'The specified owned-by `Profile` was not found.'
      )
    }

    if (username !== profile.user.username) {
      throw new ForbiddenError('Authorization required')
    }

    return profile
  }
}

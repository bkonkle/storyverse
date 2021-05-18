import {registry} from 'tsyringe'

import {useClass} from '@storyverse/server/utils'
import AuthzService from './AuthzService'

@registry([useClass(AuthzService)])
export default class AuthzRegistry {}

import {registry} from 'tsyringe'

import {useClass} from '@storyverse/api/utils'
import AuthzService from './AuthzService'

@registry([useClass(AuthzService)])
export default class AuthzRegistry {}

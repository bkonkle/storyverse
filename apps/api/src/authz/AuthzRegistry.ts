import {registry} from 'tsyringe'

import {useClass} from '../utils/Injection'
import AuthzService from './AuthzService'

@registry([useClass(AuthzService)])
export default class AuthzRegistry {}

import 'reflect-metadata'
import {registry} from 'tsyringe'

import {useClass} from '../Injection'
import Config from './Config'
import ConfigService from './ConfigService'
import {useConfig} from './ConfigTypes'

@registry([useConfig(Config), useClass(ConfigService)])
export default class ConfigRegistry {}

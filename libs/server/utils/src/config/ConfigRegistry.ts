import 'reflect-metadata'
import {registry} from 'tsyringe'

import {useClass} from '../Injection'
import ConfigService from './ConfigService'

import Config, {useConfig} from './Config'

@registry([useConfig(Config), useClass(ConfigService)])
export default class ConfigRegistry {}

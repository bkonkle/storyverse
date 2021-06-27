import 'reflect-metadata'
import {registry} from 'tsyringe'

import Config from './Config'
import {useConfig} from './ConfigTypes'

@registry([useConfig(Config)])
export default class ConfigRegistry {}

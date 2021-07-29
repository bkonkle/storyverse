import {registry} from 'tsyringe'
import {useClass} from '@storyverse/api/utils'

import CommandController from './CommandController'
import CommandService from './CommandService'

@registry([useClass(CommandController), useClass(CommandService)])
export default class CommandModule {}

import {registry} from 'tsyringe'
import {useClass} from '@storyverse/api/utils'

import MessageController from './MessageController'
import MessageService from './MessageService'

@registry([useClass(MessageController), useClass(MessageService)])
export default class MessageModule {}

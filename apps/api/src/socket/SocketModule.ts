import {registry} from 'tsyringe'
import {useClass, useRegistry} from '@storyverse/api/utils'

import ChannelModule from '../channels/ChannelModule'
import MessageModule from '../messages/MessageModule'
import CommandModule from '../commands/CommandModule'
import SocketService from './SocketService'

@registry([
  useRegistry(ChannelModule),
  useRegistry(MessageModule),
  useRegistry(CommandModule),
  useClass(SocketService),
])
export default class SocketModule {}

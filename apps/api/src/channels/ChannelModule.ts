import {registry} from 'tsyringe'
import {useClass} from '@storyverse/api/utils'

import ChannelController from './ChannelController'
import ChannelService from './ChannelService'

@registry([useClass(ChannelController), useClass(ChannelService)])
export default class ChannelModule {}

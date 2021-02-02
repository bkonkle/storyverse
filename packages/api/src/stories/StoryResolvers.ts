import {Resolvers, QueryResolvers, MutationResolvers, Story} from '../Schema'
import {Context} from '../utils/Context'

export default class StoryResolvers {
  getResolvers = (): Resolvers => ({
    Query: {
      getStory: this.getStory,
      getManyStories: this.getManyStories,
    },
    Mutation: {
      createStory: this.createStory,
      updateStory: this.updateStory,
      deleteStory: this.deleteStory,
    },
  })

  getStory: QueryResolvers<Context>['getStory'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log(`>- StoryResolvers.getStory -<`, args)

    return {} as Story
  }

  getManyStories: QueryResolvers<Context>['getManyStories'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- StoriesResolvers.getManyStories -<', args)

    return {
      data: [] as Story[],
      count: 0,
      total: 0,
      page: 0,
      pageCount: 0,
    }
  }

  createStory: MutationResolvers<Context>['createStory'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- StoryResolvers.createStory -<', args)

    return {}
  }

  updateStory: MutationResolvers<Context>['updateStory'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- StoryResolvers.updateStory -<', args)

    return {}
  }

  deleteStory: MutationResolvers<Context>['deleteStory'] = async (
    _parent,
    args,
    _context,
    _resolveInfo
  ) => {
    console.log('>- StoryResolvers.deleteStory -<', args)

    return {}
  }
}

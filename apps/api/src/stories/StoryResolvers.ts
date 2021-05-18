import {PrismaClient} from '@prisma/client'
import {injectable} from 'tsyringe'

import {
  Prisma,
  Query,
  Mutation,
  Resolvers,
  getOffset,
  paginateResponse,
} from '@storyverse/server/utils'

import {getUsername} from '../users/UserUtils'
import StoryAuthz from './StoryAuthz'
import {
  IncludeAll,
  fromOrderByInput,
  fromStoryCondition,
  fromStoryInput,
} from './StoryUtils'

@injectable()
export default class StoryResolvers implements Resolvers {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authz: StoryAuthz
  ) {}

  getAll = () => ({
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

  getStory: Query<'getStory'> = async (
    _parent,
    {id},
    _context,
    resolveInfo
  ) => {
    const include = Prisma.includeFromSelections(
      resolveInfo.operation.selectionSet,
      'getStory'
    ) as IncludeAll

    return this.prisma.story.findFirst({
      include,
      where: {id},
    })
  }

  getManyStories: Query<'getManyStories'> = async (
    _parent,
    args,
    _context,
    resolveInfo
  ) => {
    const {where, orderBy, pageSize, page} = args

    const options = {
      where: fromStoryCondition(where),
      orderBy: fromOrderByInput(orderBy),
    }
    const total = await this.prisma.story.count(options)

    const include = Prisma.includeFromSelections(
      resolveInfo.operation.selectionSet,
      'getManyStories.data'
    ) as IncludeAll

    const stories = await this.prisma.story.findMany({
      include,
      ...options,
      ...getOffset(pageSize, page),
    })

    return paginateResponse(stories, {
      total,
      pageSize,
      page,
    })
  }

  createStory: Mutation<'createStory'> = async (
    _parent,
    {input},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)

    await this.authz.create(username, input.seriesId)

    const include = Prisma.includeFromSelections(
      resolveInfo.operation.selectionSet,
      'createStory.story'
    ) as IncludeAll

    const story = await this.prisma.story.create({
      include,
      data: {
        ...input,
        seriesId: undefined,
        series: {
          connect: {id: input.seriesId},
        },
      },
    })

    return {story}
  }

  updateStory: Mutation<'updateStory'> = async (
    _parent,
    {id, input},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.update(username, id)

    const include = Prisma.includeFromSelections(
      resolveInfo.operation.selectionSet,
      'updateStory.story'
    ) as IncludeAll

    const story = await this.prisma.story.update({
      include,
      where: {id},
      data: fromStoryInput(input),
    })

    return {story}
  }

  deleteStory: Mutation<'deleteStory'> = async (
    _parent,
    {id},
    context,
    resolveInfo
  ) => {
    const username = getUsername(context)
    await this.authz.delete(username, id)

    const include = Prisma.includeFromSelections(
      resolveInfo.operation.selectionSet,
      'deleteStory.story'
    ) as IncludeAll

    const story = await this.prisma.story.delete({
      include,
      where: {id},
    })

    return {story}
  }
}

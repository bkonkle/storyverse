import * as Universe from './factories/UniverseFactory'
import * as Series from './factories/SeriesFactory'
import * as Story from './factories/StoryFactory'

export const universes = [Universe.make(), Universe.make()]

export const series = [
  Series.make({universe: universes[0]}),
  Series.make({universe: universes[0]}),
  Series.make({universe: universes[0]}),
  Series.make({universe: universes[1]}),
  Series.make({universe: universes[1]}),
  Series.make({universe: universes[1]}),
  Series.make({universe: universes[1]}),
]

export const stories = [
  Story.make({series: series[0]}),
  Story.make({series: series[0]}),
  Story.make({series: series[0]}),
  Story.make({series: series[0]}),
  Story.make({series: series[0]}),
  Story.make({series: series[1]}),
  Story.make({series: series[1]}),
  Story.make({series: series[1]}),
  Story.make({series: series[1]}),
  Story.make({series: series[1]}),
  Story.make({series: series[1]}),
  Story.make({series: series[1]}),
  Story.make({series: series[2]}),
  Story.make({series: series[2]}),
  Story.make({series: series[2]}),
  Story.make({series: series[2]}),
  Story.make({series: series[2]}),
  Story.make({series: series[2]}),
  Story.make({series: series[2]}),
  Story.make({series: series[3]}),
  Story.make({series: series[3]}),
  Story.make({series: series[4]}),
  Story.make({series: series[4]}),
  Story.make({series: series[4]}),
  Story.make({series: series[5]}),
  Story.make({series: series[5]}),
  Story.make({series: series[5]}),
  Story.make({series: series[5]}),
  Story.make({series: series[5]}),
  Story.make({series: series[6]}),
  Story.make({series: series[6]}),
  Story.make({series: series[6]}),
  Story.make({series: series[6]}),
  Story.make({series: series[6]}),
]

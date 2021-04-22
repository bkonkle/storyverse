import React from 'react'

import {Series as SeriesData} from '@storyverse/graphql/Schema'

import * as Fixtures from '../../test/Fixtures'
import CardList from '../cards/CardList'
import Card from '../cards/Card'

export interface SeriesProps {
  series: SeriesData[]
}

const defaultProps: SeriesProps = {
  series: Fixtures.series,
}

export const Series = (props: SeriesProps) => {
  const {series} = props

  return (
    <CardList title="Featured Series">
      {series &&
        series.map((series) => (
          <Card
            key={series.id}
            image={series.picture}
            title={series.name}
            summary={series.description?.text}
          />
        ))}
    </CardList>
  )
}

Series.defaultProps = defaultProps

export default Series

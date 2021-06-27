import {format, formatDistanceToNow} from 'date-fns'

import {Schema} from '@storyverse/graphql'
import {Admin} from '@storyverse/web/utils/urls'

import Card from '../../cards/Card'
import {Table, Row, Column, Link} from '../../tables/Tables'

export interface ListProps {
  series: Schema.SeriesDataFragment[]
}

export default function List({series}: ListProps) {
  return (
    <Card
      title="Series"
      button={{
        title: 'Create',
        href: Admin.Series.create(),
      }}
    >
      <Table headers={['Name', 'Stories', 'Authors', 'Created', 'Updated']}>
        {series.map((series) => (
          <Row key={series.id}>
            <Column key="name" header className="text-left">
              <Link href={Admin.Series.update(series.id)}>{series.name}</Link>
            </Column>
            {/* TODO */}
            <Column key="stories">22</Column>
            {/* TODO */}
            <Column key="authors">3</Column>
            <Column key="created">
              {format(new Date(series.createdAt), 'EEEE, MMMM do, yyyy')}
            </Column>
            <Column key="updated">
              <p title="Test">
                {formatDistanceToNow(new Date(series.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </Column>
          </Row>
        ))}
      </Table>
    </Card>
  )
}

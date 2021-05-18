import {format, formatDistanceToNow} from 'date-fns'

import {Schema} from '@storyverse/graphql'
import {Admin} from '@storyverse/client/utils/urls'

import Card from '../../cards/Card'
import {Table, Row, Column, Link} from '../../tables/Tables'

export interface ListProps {
  universes: Schema.UniverseDataFragment[]
}

export default function List({universes}: ListProps) {
  return (
    <Card
      title="Universes"
      button={{
        title: 'Create',
        href: Admin.Universes.create(),
      }}
    >
      <Table headers={['Name', 'Series', 'Stories', 'Created', 'Updated']}>
        {universes.map((universe) => (
          <Row key={universe.id}>
            <Column key="name" header className="text-left">
              <Link href={Admin.Universes.update(universe.id)}>
                {universe.name}
              </Link>
            </Column>
            {/* TODO */}
            <Column key="series">3</Column>
            {/* TODO */}
            <Column key="stories">22</Column>
            <Column key="created">
              {format(new Date(universe.createdAt), 'EEEE, MMMM do, yyyy')}
            </Column>
            <Column key="updated">
              <p title="Test">
                {formatDistanceToNow(new Date(universe.updatedAt), {
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

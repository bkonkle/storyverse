import {format, formatDistanceToNow} from 'date-fns'

import {Schema} from '@storyverse/graphql'
import {Admin} from '@storyverse/web/utils/urls'

import Card from '../../cards/Card'
import {Table, Row, Column, Link} from '../../tables/Tables'

export interface ListProps {
  stories: Schema.StoryDataFragment[]
}

export default function List({stories}: ListProps) {
  return (
    <Card
      title="Stories"
      button={{
        title: 'Create',
        href: Admin.Stories.create(),
      }}
    >
      <Table headers={['Name', 'Readers', 'Comments', 'Created', 'Updated']}>
        {stories.map((story) => (
          <Row key={story.id}>
            <Column key="name" header className="text-left">
              <Link href={Admin.Stories.update(story.id)}>{story.name}</Link>
            </Column>
            {/* TODO */}
            <Column key="readers">22</Column>
            {/* TODO */}
            <Column key="comments">3</Column>
            <Column key="created">
              {format(new Date(story.createdAt), 'EEEE, MMMM do, yyyy')}
            </Column>
            <Column key="updated">
              <p title="Test">
                {formatDistanceToNow(new Date(story.updatedAt), {
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

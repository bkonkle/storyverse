import {useRouter} from 'next/router'
import {format, formatDistanceToNow} from 'date-fns'

import {Schema} from '@storyverse/graphql'

import Card from '../../cards/Card'
import {Table, Row, Column} from '../../tables/Tables'
import Button from '../../buttons/Button'

export default function UniversesTable() {
  const router = useRouter()

  const [{data: userData}] = Schema.useGetCurrentUserQuery()
  const user = userData?.getCurrentUser
  const profile = user?.profile

  const [{data: universeData}] = Schema.useGetMyUniversesQuery({
    variables: {profileId: profile?.id || ''},
    pause: !profile,
  })
  const universes = universeData?.getManyUniverses.data || []

  return (
    <Card
      title="Universes"
      button={{
        title: 'Create',
        onClick: () => router.push('/admin/universes/create'),
      }}
    >
      <Table headers={['Name', 'Series', 'Stories', 'Created', 'Updated', '']}>
        {universes.map((universe) => (
          <Row key={universe.id}>
            <Column key="name" header className="text-left">
              {universe.name}
            </Column>
            {/* TODO */}
            <Column key="series">3</Column>
            {/* TODO */}
            <Column key="stories">22</Column>
            <Column key="created">
              {format(new Date(universe.createdAt), 'EEEE, MMMM do, yyyy')}
            </Column>
            <Column key="updated">
              {formatDistanceToNow(new Date(universe.updatedAt), {
                addSuffix: true,
              })}
            </Column>
            <Column>
              <Button dark>Edit</Button>
            </Column>
          </Row>
        ))}
      </Table>
    </Card>
  )
}

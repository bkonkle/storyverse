import {useRouter} from 'next/router'

import Card from '../../cards/Card'
import {Table, Row, Column} from '../../tables/Tables'

export default function UniversesTable() {
  const router = useRouter()

  return (
    <Card
      title="Universes"
      button={{
        title: 'Create',
        onClick: () => router.push('/admin/universes/create'),
      }}
    >
      <Table headers={['Name', 'Series', 'Stories', 'Created', 'Updated']}>
        <Row>
          <Column key="name" header className="text-left">
            Test Universe
          </Column>
          <Column key="series">3</Column>
          <Column key="stories">22</Column>
          <Column key="created">Monday, April 20th, 2021</Column>
          <Column key="updated">Tuesday, April 21st, 2021</Column>
        </Row>
      </Table>
    </Card>
  )
}

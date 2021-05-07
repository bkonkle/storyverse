import Head from 'next/head'
import {withUrqlClient} from 'next-urql'
import {useRouter} from 'next/router'

import Admin from '@storyverse/components/layouts/Admin'
import {UniverseUpdateSection} from '@storyverse/components/admin/sections/universes'
import {getConfig} from '@storyverse/graphql'

export function CreateUniversePage() {
  const router = useRouter()
  const {id} = router.query

  if (!id) {
    // TODO: <NotFound />
    return null
  }

  return (
    <Admin>
      <Head>
        <title>Storyverse - Create Universe</title>
      </Head>
      <UniverseUpdateSection id={Array.isArray(id) ? id.join('') : id} />
    </Admin>
  )
}

export default withUrqlClient(getConfig, {ssr: true})(CreateUniversePage)

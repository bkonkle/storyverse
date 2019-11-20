import React, {FC} from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import {Helmet} from 'react-helmet'

import Header from './Header'

interface Props {
  children?: React.ReactNode
}

const Layout: FC<Props> = ({children}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Helmet>
      <Header siteTitle={data.site.siteMetadata.title} />
      <main>{children}</main>
    </>
  )
}

export default Layout

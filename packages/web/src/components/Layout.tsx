import React, {FC} from 'react'
import {useStaticQuery, graphql} from 'gatsby'
import {Helmet} from 'react-helmet'
import {makeStyles} from '@material-ui/core/styles'

import Header from './Header'

interface Props {
  children?: React.ReactNode
}

const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(10),
  },
}))

const Layout: FC<Props> = ({children}) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)

  const classes = useStyles()

  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Helmet>
      <Header
        siteTitle={data.site.siteMetadata.title}
        siteDescription={data.site.siteMetadata.description}
      />
      <main className={classes.main}>{children}</main>
    </>
  )
}

export default Layout

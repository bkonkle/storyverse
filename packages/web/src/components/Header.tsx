import React, {FC} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import {isAuthenticated} from '../data/AuthClient'
import UserIcon from './UserIcon'
import LoginButton from './LoginButton'

interface Props {
  siteTitle: string
  siteDescription?: string
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  subtitle: {
    marginLeft: theme.spacing(2),
  },
}))

const Header: FC<Props> = ({siteTitle, siteDescription}) => {
  const classes = useStyles()
  const isAuth = isAuthenticated()

  return (
    <AppBar>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          {isAuth && <MenuIcon />}
        </IconButton>
        <Typography variant="h5" className={classes.title}>
          {siteTitle}
          {siteDescription && (
            <Typography
              variant="subtitle1"
              display="inline"
              className={classes.subtitle}
            >
              {siteDescription}
            </Typography>
          )}
        </Typography>
        {!isAuth && <LoginButton />}
        {isAuth && <UserIcon />}
      </Toolbar>
    </AppBar>
  )
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

import React, {FC} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import {isAuthenticated, login, logout} from '../data/AuthClient'
import UserIcon from './UserIcon'

interface Props {
  siteTitle: string
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
}))

const Header: FC<Props> = ({siteTitle}) => {
  const classes = useStyles()

  return (
    <header>
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {siteTitle}
          </Typography>
          {!isAuthenticated() && (
            <Button color="inherit" onClick={login}>
              Login
            </Button>
          )}
          {isAuthenticated() && <UserIcon onLogout={logout} />}
        </Toolbar>
      </AppBar>
    </header>
  )
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header

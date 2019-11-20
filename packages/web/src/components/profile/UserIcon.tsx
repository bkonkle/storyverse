import React, {FC, useContext, useState} from 'react'
import {navigate} from 'gatsby'
import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import CurrentUser from '../CurrentUser'

interface Props {
  onLogout(): void
}

const useStyles = makeStyles(theme => ({
  avatarMenu: {
    flexDirection: 'column',
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  avatarIcon: {
    fontSize: theme.spacing(16),
  },
}))

const UserIcon: FC<Props> = ({onLogout}) => {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState()
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(undefined)
  }

  const handleProfile = () => {
    navigate('/app/profile')
    handleClose()
  }

  const user = useContext(CurrentUser.Context)
  if (!user) {
    return null
  }

  const profile = user.profilesByUserId.nodes[0]
  const displayName = (profile && profile.displayName) || 'New User'
  const picture = (profile && profile.picture) || undefined

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={event => setAnchorEl(event.currentTarget)}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile} className={classes.avatarMenu}>
          <Avatar className={classes.avatar} alt={displayName} src={picture}>
            {!picture && <AccountCircle className={classes.avatarIcon} />}
          </Avatar>
          <Typography align="center">{displayName}</Typography>
        </MenuItem>
        <MenuItem></MenuItem>
        <MenuItem onClick={onLogout}>Log Out</MenuItem>
      </Menu>
    </div>
  )
}

export default UserIcon

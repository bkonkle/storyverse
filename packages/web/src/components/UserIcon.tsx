import React, {FC, useEffect, useState} from 'react'
import {navigate} from 'gatsby'
import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import {logout} from '../data/AuthClient'
import {handleUserData, getProfile} from '../data/UserData'
import {useGetCurrentUserQuery, useCreateUserMutation} from '../data/Schema'

const useStyles = makeStyles((theme) => ({
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

const UserIcon: FC = () => {
  const classes = useStyles()
  const [{data, fetching}] = useGetCurrentUserQuery()
  const [, createUser] = useCreateUserMutation()
  const [anchorEl, setAnchorEl] = useState()

  useEffect(handleUserData(createUser, data), [data])

  if (fetching || !data) {
    return null
  }

  const profile = getProfile(data.getCurrentUser)
  const displayName = profile?.displayName || 'New User'
  const picture = profile?.picture || undefined

  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(undefined)
  }

  const handleProfile = () => {
    navigate('/app/profile')
    handleClose()
  }

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        // onClick={event => setAnchorEl(event.currentTarget)}
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
        <MenuItem onClick={logout}>Log Out</MenuItem>
      </Menu>
    </div>
  )
}

export default UserIcon

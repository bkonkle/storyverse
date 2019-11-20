import React, {FC, useContext, useState} from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import CurrentUser from './CurrentUser'

interface Props {
  onLogout(): void
}

const UserIcon: FC<Props> = ({onLogout}) => {
  const [anchorEl, setAnchorEl] = useState()
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(undefined)
  }

  const user = useContext(CurrentUser.Context)
  if (!user) {
    return null
  }

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
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={onLogout}>Log Out</MenuItem>
      </Menu>
    </div>
  )
}

export default UserIcon

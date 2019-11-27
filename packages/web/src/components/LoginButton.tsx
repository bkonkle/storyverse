import React, {FC} from 'react'
import Button from '@material-ui/core/Button'

import {login} from '../data/AuthClient'

const LoginIcon: FC = () => {
  return (
    <Button color="inherit" onClick={login}>
      Login
    </Button>
  )
}

export default LoginIcon

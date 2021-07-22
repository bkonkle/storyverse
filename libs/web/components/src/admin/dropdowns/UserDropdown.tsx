import clsx from 'clsx'
import {signIn} from 'next-auth/client'

import {Schema} from '@storyverse/graphql'
import Urls, {Admin} from '@storyverse/web/utils/urls'

import {handleLogout} from '../../utils/auth'
import Button from '../buttons/Button'
import {Dropdown, Link, Separator} from './Dropdowns'

export default function UserDropdown() {
  const [{fetching, data}] = Schema.useGetCurrentUserQuery()

  const user = data?.getCurrentUser
  const profile = user?.profile

  if (fetching || !profile) {
    return (
      <Button
        onClick={(event) => {
          event.stopPropagation()
          event.nativeEvent.stopImmediatePropagation()

          signIn('auth0')
        }}
      >
        Login
      </Button>
    )
  }

  const toggle = profile.picture && (
    <img
      alt={profile.displayName || '...'}
      className={clsx(
        'w-full',
        'rounded-full',
        'align-middle',
        'border-none',
        'shadow-lg'
      )}
      src={profile.picture}
    />
  )

  return (
    <Dropdown toggle={toggle}>
      <Link href={Admin.home()}>Manage</Link>
      <Link href={Admin.User.profile()}>Profile</Link>
      <Link href={Admin.User.settings()}>Settings</Link>
      <Separator />
      <Link href={Urls.home()} onClick={handleLogout}>
        Log Out
      </Link>
    </Dropdown>
  )
}

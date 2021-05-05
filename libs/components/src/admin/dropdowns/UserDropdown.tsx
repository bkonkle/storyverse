import clsx from 'clsx'

import {Schema} from '@storyverse/graphql'

import {handleLogout} from '../../utils/auth'
import {Dropdown, Link, Separator} from './Dropdowns'

export default function UserDropdown() {
  const [{fetching, data}] = Schema.useGetCurrentUserQuery()

  const user = data?.getCurrentUser
  const profile = user?.profile

  if (fetching || !profile) {
    return null
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
      <Link href="/admin/user/profile">Profile</Link>
      <Link href="/admin/user/settings">Settings</Link>
      <Separator />
      <Link href="/" onClick={handleLogout}>
        Log Out
      </Link>
    </Dropdown>
  )
}

import clsx from 'clsx'

import {Schema} from '@storyverse/graphql'

import Urls, {Admin} from '@storyverse/client/utils/urls'

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

import Urls, {Admin} from '@storyverse/client/utils/urls'

import {handleLogout} from '../../../utils/auth'
import SidebarHeading from './SidebarHeading'
import SidebarLink from './SidebarLink'

export default function SidebarHeader() {
  return (
    <>
      <SidebarHeading>Story Management</SidebarHeading>

      <ul className="md:flex-col md:min-w-full flex flex-col list-none">
        <SidebarLink href={Admin.Universes.list()} icon="fa-sun">
          Universes
        </SidebarLink>

        <SidebarLink href={Admin.Series.list()} icon="fa-book">
          Series
        </SidebarLink>

        <SidebarLink href={Admin.Stories.list()} icon="fa-book-open">
          Stories
        </SidebarLink>

        <SidebarLink href={Admin.Authors.list()} icon="fa-user-edit">
          Authors
        </SidebarLink>
      </ul>

      <SidebarHeading>User</SidebarHeading>

      <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
        <SidebarLink href={Admin.User.profile()} icon="fa-user-circle">
          Profile
        </SidebarLink>

        <SidebarLink href={Admin.User.settings()} icon="fa-tools">
          Settings
        </SidebarLink>

        <SidebarLink
          href={Urls.home()}
          onClick={handleLogout}
          icon="fa-sign-out-alt"
        >
          Log Out
        </SidebarLink>
      </ul>
    </>
  )
}

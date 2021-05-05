import {handleLogout} from '../../../utils/auth'
import SidebarHeading from './SidebarHeading'
import SidebarLink from './SidebarLink'

export default function SidebarHeader() {
  return (
    <>
      <SidebarHeading>Story Management</SidebarHeading>

      <ul className="md:flex-col md:min-w-full flex flex-col list-none">
        <SidebarLink href="/admin/universes" icon="fa-sun">
          Universes
        </SidebarLink>

        <SidebarLink href="/admin/series" icon="fa-book">
          Series
        </SidebarLink>

        <SidebarLink href="/admin/stories" icon="fa-book-open">
          Stories
        </SidebarLink>

        <SidebarLink href="/admin/tables" icon="fa-user-edit">
          Authors
        </SidebarLink>
      </ul>

      <SidebarHeading>User</SidebarHeading>

      <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
        <SidebarLink href="/admin/user/profile" icon="fa-user-circle">
          Profile
        </SidebarLink>

        <SidebarLink href="/admin/user/settings" icon="fa-tools">
          Settings
        </SidebarLink>

        <SidebarLink href="/" onClick={handleLogout} icon="fa-sign-out-alt">
          Log Out
        </SidebarLink>
      </ul>
    </>
  )
}

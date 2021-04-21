import React from 'react'

import SidebarHeading from './SidebarHeading'
import SidebarLink from './SidebarLink'

export default function SidebarHeader() {
  return (
    <>
      <SidebarHeading>Story Management</SidebarHeading>

      <ul className="md:flex-col md:min-w-full flex flex-col list-none">
        <SidebarLink href="/app/universes" icon="fa-sun">
          Universes
        </SidebarLink>

        <SidebarLink href="/app/series" icon="fa-book">
          Series
        </SidebarLink>

        <SidebarLink href="/app/stories" icon="fa-book-open">
          Stories
        </SidebarLink>

        <SidebarLink href="/admin/tables" icon="fa-user-edit">
          Authors
        </SidebarLink>
      </ul>

      <SidebarHeading>User</SidebarHeading>

      <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
        <SidebarLink href="/auth/login" icon="fa-user-circle">
          Profile
        </SidebarLink>

        <SidebarLink href="/auth/login" icon="fa-tools">
          Settings
        </SidebarLink>

        <SidebarLink href="/auth/register" icon="fa-sign-out-alt">
          Log Out
        </SidebarLink>
      </ul>
    </>
  )
}

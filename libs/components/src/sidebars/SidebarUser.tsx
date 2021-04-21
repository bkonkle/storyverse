import React from 'react'

import NotificationDropdown from '../dropdowns/NotificationDropdown'
import UserDropdown from '../dropdowns/UserDropdown'

export default function SidebarUser() {
  return (
    <ul className="md:hidden items-center flex flex-wrap list-none">
      <li className="inline-block relative">
        <NotificationDropdown />
      </li>
      <li className="inline-block relative">
        <UserDropdown />
      </li>
    </ul>
  )
}

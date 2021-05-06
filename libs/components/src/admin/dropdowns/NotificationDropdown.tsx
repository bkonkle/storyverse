import {Dropdown, Link, Separator} from './Dropdowns'

export default function NotificationDropdown() {
  return (
    <Dropdown toggle={<i className="fas fa-bell"></i>}>
      <Link href="#pablo" onClick={(e) => e.preventDefault()}>
        Action
      </Link>
      <Link href="#pablo" onClick={(e) => e.preventDefault()}>
        Another action
      </Link>
      <Link href="#pablo" onClick={(e) => e.preventDefault()}>
        Something else here
      </Link>
      <Separator />
      <Link href="#pablo" onClick={(e) => e.preventDefault()}>
        Seprated link
      </Link>
    </Dropdown>
  )
}

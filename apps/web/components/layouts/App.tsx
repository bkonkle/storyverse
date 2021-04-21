import React, {ReactNode} from 'react'

import {useInitUser} from '@storyverse/shared/data/User'
import AdminNavbar from '../../components/navbars/AdminNavbar'
import Sidebar from '../../components/sidebars/Sidebar'
import FooterAdmin from '../../components/footers/FooterAdmin'

export interface AppProps {
  children: ReactNode
}

export const App = (props: AppProps) => {
  const {children} = props
  const {user, loading} = useInitUser({requireUser: true})

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {loading || !user ? null : children}
          <FooterAdmin />
        </div>
      </div>
    </>
  )
}

export default App

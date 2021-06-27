import {ReactNode} from 'react'
import Head from 'next/head'

import AdminNavbar from '../admin/navbars/AdminNavbar'
import NavSidebar from '../admin/sidebars/nav/NavSidebar'
import FooterAdmin from '../admin/footers/FooterAdmin'

export interface AdminProps {
  children: ReactNode
}

export const Admin = (props: AdminProps) => {
  const {children} = props

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="A collaborative storytelling hub. Create a story universe, invite friends to contribute stories, and follow your favorites!"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            'Storyverse'
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content="Storyverse" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <NavSidebar />

      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  )
}

export default Admin

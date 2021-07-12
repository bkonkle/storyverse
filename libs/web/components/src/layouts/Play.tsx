import {ReactNode} from 'react'
import Head from 'next/head'

export interface PlayLayoutProps {
  children: ReactNode
}

export const PlayLayout = (props: PlayLayoutProps) => {
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

      {children}
    </>
  )
}

export default PlayLayout

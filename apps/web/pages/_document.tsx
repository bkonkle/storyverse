import React from 'react'
import Document, {Html, Head, Main, NextScript} from 'next/document'

export default class AppDocument extends Document {
  render() {
    return (
      <Html lang="en" className="h-full">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="shortcut icon" href="/img/brand/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/img/brand/apple-icon.png"
          />
        </Head>
        <body className="h-full text-blueGray-700 antialiased">
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

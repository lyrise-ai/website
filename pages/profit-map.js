import React from 'react'
import Head from 'next/head'
import ProfitMapPage from '../src/components/ProfitMap/ProfitMapPage'

export default function ProfitMap() {
  return (
    <>
      <Head>
        <title>Joseph, your Chief AI Officer | LyRise Profit Map</title>
        <meta
          name="description"
          content="Joseph reads how your company works, finds where the money leaks, and prices the agent that stops it — before you commit to anything."
        />
        <meta name="theme-color" content="#08080E" />
        <link
          rel="preload"
          href="/fonts/figtree/figtree-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <ProfitMapPage />
    </>
  )
}

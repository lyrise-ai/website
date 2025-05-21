import React from 'react'
import MainHeader from './MainHeader'
import MainFooter from './MainFooter'

function MainLayout({ children }) {
  return (
    <main className="w-full min-h-screen h-full relative rebranding-landing-page flex flex-col">
      <MainHeader />
      {children}
      <MainFooter />
    </main>
  )
}

export default MainLayout

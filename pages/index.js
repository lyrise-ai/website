import '@fontsource/poppins'
import amplitude from 'amplitude-js'
import * as React from 'react'
import ReactGA from 'react-ga'
import RevampLanding from '../src/components/RevampLanding'

export default function Index() {
  React.useEffect(() => {
    const scrollToSection = () => {
      const hash = window.location.hash
      if (hash) {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    scrollToSection()
  }, [])

  React.useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_ENV === 'production' &&
      typeof window !== 'undefined'
    ) {
      amplitude.getInstance().logEvent('visitedEmployerHomePage')
      ReactGA.event({
        category: 'MainLandingPage',
        action: 'visitedEmployerHomePage',
      })
    }
  }, [])

  return <RevampLanding />
}

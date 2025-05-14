import { useEffect, useRef } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import Lenis from 'lenis'

export default function useLenis(options = {}) {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Default options for Lenis
    const defaultOptions = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    }

    // Merge default options with user options
    const lenisOptions = { ...defaultOptions, ...options }

    // Initialize Lenis
    lenisRef.current = new Lenis(lenisOptions)

    // Integrate with requestAnimationFrame
    function raf(time) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
    }
  }, [options])

  return lenisRef.current
}

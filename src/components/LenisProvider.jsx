import React, { useEffect } from 'react'
import useLenis from '../hooks/useLenis'

export default function LenisProvider({ children, options = {} }) {
  // Initialize Lenis with custom options
  const lenis = useLenis(options)

  return <>{children}</>
}

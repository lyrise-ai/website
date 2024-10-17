import React, { useEffect, useRef } from 'react'

// @deprecated
// this is a video component that will play when the user scrolls to it

export default function Video() {
  const videoRef = useRef(null)

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: [0.25, 0.75],
    }

    const handlePlay = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      })
    }

    const observer = new IntersectionObserver(handlePlay, options)

    const currentVideoRef = videoRef.current
    if (currentVideoRef) {
      observer.observe(currentVideoRef)
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef)
      }
    }
  }, [])

  return (
    <video
      id="video"
      preload="metadata" // this will load entire video while page loads
      width="auto"
      ref={videoRef}
      loop
      autoPlay
      muted
      playsInline
      className="scale-105"
    >
      <source src="hero-video.mp4" type="video/mp4" />
    </video>
  )
}

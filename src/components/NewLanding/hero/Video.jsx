import React, { useEffect, useRef, useState } from 'react'

// utility function to request fullscreen from different browsers
const requestFullscreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen()
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen()
  }
}

const playAndEnterFullscreen = (videoElement) => {
  videoElement
    .play()
    .then(() => {
      requestFullscreen(videoElement)
    })
    .catch((error) => {
      console.log('Error attempting to play the video:', error)
    })
}

export default function Video({ isShown }) {
  const videoRef = useRef(null)
  const [isInViewport, setIsInViewport] = useState(false)

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: [0.25, 0.75],
    }

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInViewport(true)
          if (isShown) {
            videoRef.current.play()
          }
        } else {
          setIsInViewport(false)
          videoRef.current.pause()
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    const currentVideoRef = videoRef.current
    if (currentVideoRef) {
      observer.observe(currentVideoRef)
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef)
      }
    }
  }, [isShown])

  return (
    <video
      id="video"
      preload="metadata" // this will load entire video while page loads
      width="auto"
      poster="hero-vidoe-placeholder.png"
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

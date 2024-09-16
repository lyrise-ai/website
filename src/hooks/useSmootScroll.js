import { useCallback } from 'react'

export function useSmoothScroll() {
  return useCallback((element, to, duration) => {
    const start = element.scrollTop
    const change = to - start
    const startTime = performance.now()

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime
      if (elapsedTime > duration) {
        element.scrollTop = to
        return
      }

      const progress = elapsedTime / duration
      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      element.scrollTop = start + change * easeInOutCubic(progress)

      requestAnimationFrame(animateScroll)
    }

    requestAnimationFrame(animateScroll)
  }, [])
}

import { useEffect } from 'react'
import { useSmoothScroll } from './useSmootScroll'

const SCROLL_DURATION = 150

export default function useScrollOnNewContent(scrollRef, contentState) {
  const smoothScroll = useSmoothScroll()

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current
      const scrollToBottom = () => {
        const scrollHeight = scrollElement.scrollHeight
        const height = scrollElement.clientHeight
        const maxScrollTop = scrollHeight - height
        smoothScroll(scrollElement, maxScrollTop, SCROLL_DURATION) // 300ms duration
      }

      // scroll depending on browser support
      if ('scrollBehavior' in document.documentElement.style) {
        // Native smooth scrolling
        scrollToBottom()
      } else {
        // Fallback for browsers that don't support scroll-behavior
        smoothScroll(scrollElement, scrollElement.scrollHeight, SCROLL_DURATION)
      }
    }
  }, [contentState, smoothScroll])
}

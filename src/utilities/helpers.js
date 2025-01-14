export function getSeniorityFromYears(years) {
  if (years >= 5) {
    return 'Senior'
  }
  if (years >= 3) {
    return 'Mid-Senior'
  }
  return 'Junior'
}

export const formatDateYyyyMmDd = (date) => {
  return date.toISOString().split('T')[0]
}

export function checkTimeOverlap(startTime1, endTime1, startTime2, endTime2) {
  // Check for overlap
  return startTime1 < endTime2 && startTime2 < endTime1 // Overlap exists if true
}

export const scrollIntoView = (element) => {
  const section = document?.getElementById(element)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

export const isElementInViewport = (elementId) => {
  if (typeof window === 'undefined') {
    // Running on the server, return false or handle appropriately
    return false
  }

  const element = document.getElementById(elementId)
  if (!element) return false

  const rect = element.getBoundingClientRect()

  // Check if the element is in the viewport
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

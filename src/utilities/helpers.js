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

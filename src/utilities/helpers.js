export function getSeniorityFromYears(years) {
  if (years >= 5) {
    return 'Senior'
  }
  if (years >= 3) {
    return 'Mid-Senior'
  }
  return 'Junior'
}

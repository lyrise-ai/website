export function getSeniorityFromYears(years) {
  if (years >= 5) {
    return 'Senior'
  } else if (years >= 3) {
    return 'Mid-Senior'
  } else {
    return 'Junior'
  }
}

import api from './api.services'
import { formatDateYyyyMmDd } from '../utilities/helpers'

export const checkMeetingAvailability = async (date) => {
  if (date === null) return []

  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)

  try {
    const busyPeriods = await api.post(`/booking/availability`, {
      date: formatDateYyyyMmDd(tomorrow),
    })

    return busyPeriods.map((item) => ({
      start: new Date(item.start),
      end: new Date(item.end),
    }))
  } catch (err) {
    console.error('Error checking meeting availability:', err)
    return []
  }
}

export const bookMeeting = async (email, start, end) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return api.post(`/booking/book`, {
    start: {
      dateTime: start.toISOString(),
      timeZone: userTimeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: userTimeZone,
    },
    attendees: [{ email }],
  })
}

import { useEffect, useState } from 'react'
import { checkMeetingAvailability } from '../services/book.services'
import { checkTimeOverlap } from '../utilities/helpers'

// default times list
const DEFAULT_TIMES_LIST = [
  { text: '12:00 PM', value: '12:00' },
  { text: '1:00 PM', value: '13:00' },
  { text: '2:00 PM', value: '14:00' },
  { text: '3:00 PM', value: '15:00' },
]

export default function useAvailableTimes(date) {
  const [times, setTimes] = useState([])
  const [isTimesLoading, setIsTimesLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setIsTimesLoading(true)

      const busyTimes = await checkMeetingAvailability(date)

      // if no busy times, set default times
      if (busyTimes.length === 0) {
        setTimes(DEFAULT_TIMES_LIST)
        setIsTimesLoading(false)
      } else {
        // if busy times, check for each time if it's available
        const availableTimes = DEFAULT_TIMES_LIST.filter((time) => {
          const startTime = new Date(date)
          const endTime = new Date(date)
          const [hours, minutes] = time.value.split(':')
          startTime.setHours(Number(hours))
          startTime.setMinutes(Number(minutes))
          endTime.setHours(Number(hours) + 1)
          endTime.setMinutes(Number(minutes))

          return !busyTimes.some((busyTime) => {
            return checkTimeOverlap(
              startTime,
              endTime,
              busyTime.start,
              busyTime.end,
            )
          })
        })

        setTimes(availableTimes)
        setIsTimesLoading(false)
      }
    })()
  }, [date])

  return { times, isTimesLoading }
}

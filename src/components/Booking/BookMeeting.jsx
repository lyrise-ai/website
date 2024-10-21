import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import Timebutton from './Timebutton'
import TimesList from './TimesList'
import useAvailableTimes from '../../hooks/useAvailableTimes'
import { bookMeeting } from '../../services/book.services'
import { ArrowLeftOutlined, ArrowRight } from '@mui/icons-material'
import RightArrowIcon from '../../assets/icons/rightArrowIcon'
import ArrowButton from '../Buttons/ArrowButton'
import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'

const mapDurationToLabel = (duration) => {
  switch (duration) {
    case 15:
      return '15 mins'
    case 30:
      return '30 mins'
    case 45:
      return '45 mins'
    case 60:
      return '1 hour'
    default:
      return '0 minutes'
  }
}

// meeting durations options (in minutes)
const DURATOINS = [15, 30, 60]

const BookMeeting = () => {
  const router = useRouter()

  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [date, setDate] = useState(null)
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState('')
  const { times, isTimesLoading } = useAvailableTimes(date)
  const [loading, setLoading] = useState(false)

  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    // if we are on first render, set date to tomorrow, and set minutes, hours and seconds to 0
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0)
    tomorrow.setMinutes(0)
    tomorrow.setSeconds(0)
    tomorrow.setMilliseconds(0)
    setDate(tomorrow)
  }, [setDate])

  const showError = (message) => {
    if (isMobile) {
      alert(message)
    } else {
      setError(message)
    }
  }

  const handleConfirm = async (e) => {
    e.preventDefault() // prevent form submission
    // check if user selected date, time and duration
    if (!date || !time || !duration) {
      showError('Please make sure to specify date, time and duration.')
      return
    }

    setLoading(true)

    try {
      const startTime = new Date(date)
      const endTime = new Date(date)

      const [hours, minutes] = time.split(':')
      startTime.setHours(Number(hours))
      startTime.setMinutes(Number(minutes))

      endTime.setHours(Number(hours))
      endTime.setMinutes(Number(minutes) + duration)

      const response = await bookMeeting(email, startTime, endTime)

      if (response === null) {
        showError('Error while creating event')
        throw new Error('Error while creating event')
      }
    } catch (error) {
      console.error('Error while creating event', error)
      setLoading(false)
      return
    }
    // TODO: implement global alerts
    alert('Meeting Booked Successfully! Check your email for more details.')
    router.push('/') // go back to home page
    setLoading(false)
  }

  return (
    <form className="relative m-3 md:m-5 max-w-4xl" onSubmit={handleConfirm}>
      {error && (
        <div className="text-red-400 text-sm md:text-base font-secondary font-semibold mx-3 absolute bottom-3">
          {error}
        </div>
      )}
      <h1 className="px-3 font-semibold text-3xl">
        Book a meeting with Lyrise
      </h1>
      <div className="px-3">
        <h3 className="text-lg font-secondary my-3 font-normal">
          Enter you email address
        </h3>
        <input
          required
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ex: name@example.com"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          className="bg-transparent w-full border-[2px] border-primary-200 rounded-lg outline-none text-base p-2 h-10"
        />
      </div>
      <div className="lg:grid grid-cols-7 my-0">
        <div className="p-3 col-span-4">
          <h3 className="text-lg font-secondary mb-3 font-normal">
            Which day works for you?
          </h3>
          <Calendar
            onChange={setDate}
            calendarType="gregory"
            value={date}
            tileDisabled={({ date }) => {
              // if day before today return true
              return date <= new Date()
              // TODO: disabled unavailable days here
            }}
            className="p-3 text-center border-[2px] border-primary-200 rounded-lg"
            tileClassName={({ date: _date, view }) => {
              let classes = ''
              // if (_date.getDay() === 0) {
              //   classes += 'text-red-500';
              // }
              if (
                date instanceof Date &&
                _date instanceof Date &&
                _date.getDate() === date.getDate() &&
                _date.getMonth() === date.getMonth() &&
                _date.getFullYear() === date.getFullYear()
              ) {
                classes += ' rounded-full bg-primary text-white '
              }
              // default classes
              return (
                classes +
                'py-1.5 font-secondary font-medium disabled:font-normal text-center disabled:text-gray-400 disabled:cursor-not-allowed disabled:line-through'
              )
            }}
            formatShortWeekday={(locale, date) => {
              return date
                .toLocaleDateString(locale, { weekday: 'short' })
                .substring(0, 2)
            }}
            prev2Label={null}
            next2Label={null}
            nextLabel={<span>&gt;</span>}
            prevLabel={<span>&lt;</span>}
          />
        </div>
        <div className="p-3 col-span-3">
          <h3 className="text-lg font-secondary mb-3 font-normal">
            How long do you need?
          </h3>
          <div className="flex mb-3 gap-3">
            {DURATOINS.map((_duration) => (
              <Timebutton
                onClick={() => setDuration(_duration)}
                selected={duration === _duration}
                text={mapDurationToLabel(_duration)}
                key={_duration}
              />
            ))}
          </div>
          <h3 className="text-lg font-secondary mb-3 font-normal">
            What time works best?
          </h3>
          <TimesList
            times={times}
            value={time}
            setValue={setTime}
            isLoading={isTimesLoading}
          />
        </div>
      </div>
      <ArrowButton
        className="mr-3 ml-auto max-sm:w-[92%] max-sm:mr-auto"
        type="submit"
        disabled={loading | isTimesLoading}
      >
        Book Meeting!
      </ArrowButton>
    </form>
  )
}

export default BookMeeting

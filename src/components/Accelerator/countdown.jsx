import { useEffect, useState } from 'react'

export default function Countdown({ timestamp = Date.now() + 100000 }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = timestamp - Date.now()
    const timeLeft = {}

    if (difference > 0) {
      timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24))
      timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      timeLeft.minutes = Math.floor((difference / 1000 / 60) % 60)
      timeLeft.seconds = Math.floor((difference / 1000) % 60)
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [timestamp])

  const addLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value
  }

  return (
    <div className="w-full max-w-sm mx-auto p-4 rounded-lg border bg-card text-card-foreground shadow-sm font-secondary">
      <div className="flex justify-center items-center space-x-4">
        {Object.keys(timeLeft).length > 0 ? (
          <>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">
                {addLeadingZero(timeLeft.days)}
              </span>
              <span className="text-sm text-muted-foreground">Days</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">
                {addLeadingZero(timeLeft.hours)}
              </span>
              <span className="text-sm text-muted-foreground">Hours</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">
                {addLeadingZero(timeLeft.minutes)}
              </span>
              <span className="text-sm text-muted-foreground">Minutes</span>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">
                {addLeadingZero(timeLeft.seconds)}
              </span>
              <span className="text-sm text-muted-foreground">Seconds</span>
            </div>
          </>
        ) : (
          <span className="text-xl font-medium">Time&apos;s up!</span>
        )}
      </div>
    </div>
  )
}

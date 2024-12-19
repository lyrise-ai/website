import { useEffect, useState } from 'react'

import SectionWrapper from './section-wrapper'

const Countdown = ({
  timestamp = Date.now() + 100000,
  withoutWrapper = false,
}) => {
  const userTimestamp = new Date(2025, 0, 1).getTime()
  // Initialize with null to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = userTimestamp - Date.now()
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
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTimestamp])

  const addLeadingZero = (value) => {
    return value < 10 ? `0${value}` : value
  }

  // Don't render anything until after client-side hydration
  if (!mounted) {
    return null
  }

  const hasTimeLeft =
    Object.keys(timeLeft).length > 0 &&
    (timeLeft.days > 0 ||
      timeLeft.hours > 0 ||
      timeLeft.minutes > 0 ||
      timeLeft.seconds > 0)

  const renderContent = () => {
    return (
      <div className="w-full max-w-sm mx-auto p-4 rounded-lg border-[0.642px] border-rose-200 bg-rose-50 text-card-foreground">
        <div className="flex justify-between items-center font-secondary text-rose-500">
          {hasTimeLeft ? (
            <>
              <TimerIcon />
              <div className="flex flex-col items-center flex-1">
                <span className="text-3xl font-semibold">
                  {addLeadingZero(timeLeft.days)}
                </span>
                <span className="text-sm text-muted-foreground text-neutral-500">
                  Days
                </span>
              </div>
              <span className="text-2xl font-semibold pb-5">:</span>
              <div className="flex flex-col items-center flex-1">
                <span className="text-3xl font-semibold">
                  {addLeadingZero(timeLeft.hours)}
                </span>
                <span className="text-sm text-muted-foreground text-neutral-500">
                  Hours
                </span>
              </div>
              <span className="text-2xl font-semibold pb-5">:</span>
              <div className="flex flex-col items-center flex-1">
                <span className="text-3xl font-semibold">
                  {addLeadingZero(timeLeft.minutes)}
                </span>
                <span className="text-sm text-muted-foreground text-neutral-500">
                  Mins
                </span>
              </div>
              <span className="text-2xl font-semibold pb-5">:</span>
              <div className="flex flex-col items-center flex-1">
                <span className="text-3xl font-semibold">
                  {addLeadingZero(timeLeft.seconds)}
                </span>
                <span className="text-sm text-muted-foreground text-neutral-500">
                  Sec
                </span>
              </div>
            </>
          ) : (
            <span className="text-xl font-medium">Time out!</span>
          )}
        </div>
      </div>
    )
  }

  if (withoutWrapper) {
    return <>{renderContent()}</>
  }

  return (
    <SectionWrapper title="Last chance to join!">
      {renderContent()}
    </SectionWrapper>
  )
}

export default Countdown

const TimerIcon = () => (
  <svg
    width="39"
    height="40"
    viewBox="0 0 39 40"
    fill="none"
    className="flex-shrink-0 h-full w-auto"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="19.7266"
      cy="23.2122"
      r="14.4551"
      stroke="#F63D68"
      strokeWidth="4"
    />
    <path
      d="M16.5143 3.93875H22.9388"
      stroke="#F63D68"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M19.7266 3.93875L19.7266 8.75711"
      stroke="#F63D68"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M19.7266 23.2122L24.5449 18.3938"
      stroke="#F63D68"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M30.1663 11.9694L30.9694 11.1663"
      stroke="#F63D68"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
)

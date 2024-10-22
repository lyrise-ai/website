import React from 'react'
import Timebutton from './Timebutton'

export default function TimesList({ times, value, setValue, isLoading }) {
  return (
    <div className="w-full flex flex-col gap-3">
      {isLoading ? (
        <span className="font-secondary text-sm md:text-base text-neutral-500 w-full text-center">
          Loading available times ...
        </span>
      ) : (
        times.map((time) => (
          <Timebutton
            onClick={() => setValue(time.value)}
            selected={time.value === value}
            text={time.text}
            key={time.value}
          />
        ))
      )}
    </div>
  )
}

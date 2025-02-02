import React from 'react'

const Thinking = () => {
  return (
    <div
      className={`
        text-base font-secondary text-wrap
        text-[rgb(55,65,81)]
        w-full p-4
        flex gap-2
        bg-transparent
        relative
      `}
    >
      <div className="flex justify-center items-center ml-2">
        <div className="relative">
          <div className="w-6 h-6 bg-[#eff2ff] rounded-full"></div>
          <div className="absolute top-0 left-0 w-6 h-6 bg-primary rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  )
}

export default Thinking

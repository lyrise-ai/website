import React from 'react'

export default function Timebutton({ onClick, text, selected }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={
        'w-full py-2 rounded-xl flex items-center justify-center border-[2px] ' +
        ' text-base font-medium transition-colors duration-200 font-poppins' +
        (selected
          ? ' bg-primary text-white hover:bg-blue-700 border-primary'
          : ' bg-transparent')
      }
    >
      {text}
    </button>
  )
}

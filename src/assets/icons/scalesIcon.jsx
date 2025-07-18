import React from 'react'

const ScalesIcon = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 3V21M8 12L4 18H12L8 12ZM16 12L12 18H20L16 12ZM8 12C8 10.9 8.9 10 10 10H14C15.1 10 16 10.9 16 12M5 21H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ScalesIcon

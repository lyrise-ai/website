import React from 'react'
import RightArrowIcon from '../../assets/icons/rightArrowIcon'

const ArrowButton = ({
  children = '',
  onClick = () => {},
  className = '',
  variant = 'default',
  showArrow = false,
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white text-primary border border-primary hover:bg-neutral-100'
      case 'white':
        return 'bg-white text-primary hover:bg-gray-100'
      case 'link':
        return 'bg-transparent text-primary hover:text-blue-700 underline'
      default:
        return 'bg-primary text-white hover:bg-blue-700'
    }
  }

  return (
    <button
      type="button"
      className={`
                p-2 px-4 font-secondary rounded-xl text-lg lg:text-xl font-medium w-fit transition-all duration-200 flex items-center justify-center group 
                ${getButtonStyles()} 
                ${className}
                hover:px-6
            `}
      onClick={onClick}
    >
      <span className={`${showArrow ? 'mr-2' : ''}`}>{children}</span>
      {showArrow && (
        <RightArrowIcon
          className={
            'transition-transform duration-200 ' +
            (showArrow ? 'group-hover:translate-x-2.5' : '')
          }
        />
      )}
    </button>
  )
}

export default ArrowButton

import React from 'react'
import RightArrowIcon from '../../assets/icons/rightArrowIcon'

const ArrowButton = ({
  children = '',
  onClick = () => {},
  className = '',
  variant = 'default',
  showArrow = false,
  extraRounded = false,
  type = 'button',
  ...rest
}) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-white text-primary border border-primary hover:bg-neutral-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed'
      case 'white':
        return 'bg-white text-primary hover:bg-gray-100 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
      case 'link':
        return 'bg-transparent text-primary hover:text-blue-700 underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed'
      default:
        return 'bg-primary text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed'
    }
  }

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={`
                p-2 px-4 font-secondary text-lg lg:text-xl font-medium w-fit transition-all duration-200 flex items-center justify-center group
                ${extraRounded ? 'rounded-full' : 'rounded-xl'}
                ${getButtonStyles()}
                ${className}
                hover:px-6
            `}
      onClick={onClick}
      {...rest}
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

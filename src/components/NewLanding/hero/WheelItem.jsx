import React from 'react'

import EngineerCard from './EngineerCard'
import CheckboxList from './CheckboxList'
import Overlay from './Overlay'

import closeSvg from '../../../assets/hero/icons/close.svg'

// import items from './hero.json'
import items from './config'

import manufacturingPng from '../../../assets/hero/icons/manufacturing.png'
import healthcarePng from '../../../assets/hero/icons/healthcare.png'
import financePng from '../../../assets/hero/icons/finance.png'
import retailPng from '../../../assets/hero/icons/retail.png'
import transportationPng from '../../../assets/hero/icons/transportation.png'

// console.log(items)

import Img from '../../Product/Img'
import Image from 'next/image'

import googleLogo from '../../../assets/hero/google.png'
import microsoftLogo from '../../../assets/hero/microsoft.png'

// default positioning
const positioning = [
  ' -translate-y-[120%] translate-x-[110%] ',
  ' -translate-y-[140%] -translate-x-[110%] ',
  ' -translate-x-[140%] translate-y-[35%] ',
  ' translate-y-[50%] translate-x-[140%] ',
  ' translate-y-[170%] ',
]

const initialActivePositioning = [
  ' -translate-y-[100%] translate-x-[80%]  ',
  ' -translate-y-[120%] -translate-x-[80%]  ',
  ' -translate-x-[60%] translate-y-[30%]  ',
  ' translate-y-[50%] translate-x-[80%]  ',
  ' translate-y-[160%]  ',
]

// active origin trasnform
const toOrigin = {
  'top-right': 'origin-bottom-left',
  'top-left': 'origin-bottom-right',
  'bottom-right': 'origin-top-left',
  'bottom-left': 'origin-top-right',
  bottom: 'origin-top',
}

const toImgUrl = {
  manufacturing: manufacturingPng,
  healthcare: healthcarePng,
  finance: financePng,
  retail: retailPng,
  transportation: transportationPng,
}

function WheelItem({
  index,
  imgSrc = 'https://picsum.photos/200',
  title = 'Hello world',
  position,
  activeItem,
  setActiveItem,
  checkboxItems = [],
}) {
  const [status, setStatus] = React.useState('idle')
  const [animationClass, setAnimationClass] = React.useState('')
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showEngineerCard, setShowEngineerCard] = React.useState(false)

  const isActive = index === activeItem

  React.useEffect(() => {
    // if activeItem is the same as this item => start active animation
    // if activeItem is not the same as this item => start idle animation
    // if activeItem is null & status is active | inactive => start inactive ani
    if (isActive) {
      setStatus('active')
    } else if (typeof activeItem === 'number') {
      setStatus('inactive')
    } else {
      setStatus('idle')
    }
  }, [activeItem])

  React.useEffect(() => {
    if (status === 'active') {
      setAnimationClass('animate-active')
      var timeout = setTimeout(() => {
        setAnimationClass(' animate-active animate-active-2')
        setIsExpanded(true)
      }, 600)
    } else if (status === 'inactive') {
      setAnimationClass('animate-inactive')
      setIsExpanded(false)
    } else {
      setAnimationClass('')
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [status])

  React.useEffect(() => {
    if (isExpanded) {
      setShowEngineerCard(true)
    } else if (showEngineerCard === true) {
      var timeout = setTimeout(() => {
        setShowEngineerCard(false)
      }, 1100)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isExpanded])

  function handleItemClick() {
    if (activeItem !== null) return // if there is an active item, do nothing
    setActiveItem(index)
  }

  function clearActiveItem() {
    setActiveItem(null)
    setAnimationClass('')
    setIsExpanded(false)
    setStatus('idle')
  }

  const alwaysClasses =
    'border-[12px] rounded-[20px] border-white bg-[#EFF2FF] p-3 flex flex-col max-w-[200px] items-center gap-3 text-blue-500 text-center cursor-pointer absolute transition-all duration-1000 '

  // const origin = isActive
  //   ? toOrigin[position]
  //   : typeof activeItem === "number"
  //   ? toOrigin[items[activeItem].position]
  //   : "";
  const origin =
    typeof activeItem === 'number' ? toOrigin[items[activeItem].position] : ''

  const imgUrl = 'manufacturing.png'

  // const imgUrl = require(`../../..${imgSrc.substr(4)}`)

  return (
    <>
      {isActive && <Overlay clearActiveItem={clearActiveItem} />}
      <div
        onClick={handleItemClick}
        className={
          alwaysClasses +
          animationClass +
          positioning[index] +
          (isActive & !isExpanded ? initialActivePositioning[index] : '') +
          origin
        }
      >
        {/* close button */}
        {isActive & isExpanded ? (
          <div
            onClick={clearActiveItem}
            className="absolute top-5 right-5 w-8 h-8rounded-full flex justify-center items-center text-blue-500 cursor-pointer"
          >
            <Image src={closeSvg} alt="close icon" layout="fill" />
          </div>
        ) : null}
        <div className="w-8">
          <Img
            src={toImgUrl[imgSrc]}
            width="100%"
            height="100%"
            objectFit="cover"
            alt={title}
          />
        </div>
        <div className="font-secondary font-bold lg:text-xl">{title}</div>
        {/* active item content */}
        {isExpanded && (
          <CheckboxList
            items={checkboxItems}
            categoryTitle={imgSrc}
            clearActiveItem={clearActiveItem}
          />
        )}
        <div></div>
        {showEngineerCard ? (
          <EngineerCard
            className={
              isActive & isExpanded ? 'engineer-card' : 'engineer-card-out'
            }
            imgSrc="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            title="AI Engineer"
            name="John Doe"
            // workedAtImages={[
            //   'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png',
            //   'https://www.freepnglogos.com/uploads/image-microsoft-logo--5.png',
            // ]}
            workedAtImages={[googleLogo, microsoftLogo]}
          />
        ) : null}
      </div>
    </>
  )
}

export default WheelItem

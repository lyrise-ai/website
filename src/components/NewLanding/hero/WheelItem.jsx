import React from 'react'
import { motion } from 'framer-motion'

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

// experts imgsrcs
import jonathanImg from '../../../assets/hero/experts/jonathan.jpeg'
import karimImg from '../../../assets/hero/experts/karim.jpeg'
import karim2Img from '../../../assets/hero/experts/karim2.png'
import loayImg from '../../../assets/hero/experts/loay.jpeg'
import omarImg from '../../../assets/hero/experts/omar.jpeg'

// companies
import cfImg from '../../../assets/hero/companies/cf.png'
import pgImg from '../../../assets/hero/companies/p&g.png'
import pwcImg from '../../../assets/hero/companies/pwc.png'
import symplImg from '../../../assets/hero/companies/sympl.png'
import udacityImg from '../../../assets/hero/companies/udacity.png'
import userpilotImg from '../../../assets/hero/companies/userpilot.png'
import visaImg from '../../../assets/hero/companies/visa.png'
import vodafoneImg from '../../../assets/hero/companies/vodafone.png'

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

const toEngineerCard = {
  'Manufacturing & Industry 4.0': {
    imgSrc: jonathanImg,
    title: 'Generative AI Expert',
    name: 'Jonathan Hodges',
    workedAtImages: [userpilotImg],
  },
  'Transportation & Logistics': {
    imgSrc: loayImg,
    title: 'AI Solution Architect',
    name: 'Loay Amin',
    workedAtImages: [pwcImg, udacityImg],
  },
  'Healthcare & Life Sciences': {
    imgSrc: omarImg,
    title: 'Data Science Exeprt',
    name: 'Omar Kamal',
    workedAtImages: [pgImg, cfImg],
  },
  'Finance & Banking': {
    imgSrc: karimImg,
    title: 'Co-Founder & CTO',
    name: 'Karim Tawfik',
    workedAtImages: [symplImg, visaImg],
  },
  'Retail & E-Commerce': {
    imgSrc: karim2Img,
    title: 'Data Science Expert',
    name: 'Karim Tawfik',
    workedAtImages: [vodafoneImg],
  },
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

  const origin =
    typeof activeItem === 'number' ? toOrigin[items[activeItem].position] : ''

  return (
    <>
      {isActive && <Overlay clearActiveItem={clearActiveItem} />}
      <motion.div
        onClick={handleItemClick}
        className={
          alwaysClasses +
          animationClass +
          positioning[index] +
          (isActive & !isExpanded ? initialActivePositioning[index] : '') +
          origin
        }
        // initial={{ marginTop: 0 }}
        // animate={{ marginTop: 10 }}
        // transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
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
            // imgSrc="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"
            // title="AI Engineer"
            // name="John Doe"
            // workedAtImages={[googleLogo, microsoftLogo]}
            imgSrc={toEngineerCard[title].imgSrc}
            title={toEngineerCard[title].title}
            name={toEngineerCard[title].name}
            workedAtImages={toEngineerCard[title].workedAtImages}
          />
        ) : null}
      </motion.div>
    </>
  )
}

export default WheelItem

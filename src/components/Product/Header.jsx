import React from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'

import Link from 'next/link'
import macBookImage from '../../assets/product/macbook.png'
import maskImage from '../../assets/product/mask-group.png'
import pathsImage from '../../assets/product/paths-group.png'
import Img from './Img'

export default function Header() {
  return (
    <div className="h-auto w-full max-w-[1440px] m-auto relative overflow-hidden">
      <HeaderImages />
      <HeaderContent />
    </div>
  )
}

// const Important = (classes) => {
//   return classes
//     .split(' ')
//     .map((x) => '!' + x)
//     .join('')
// }

const HeaderImages = () => {
  return (
    <div className="w-full h-auto flex items-center mt-0 md:mt-1">
      <div className="w-[90%] object-cover z-30 absolute translate-x-[12%] translate-y-5 md:translate-y-32 scale-100">
        <Img src={macBookImage} />
      </div>
      <div className="w-[95%] object-contain absolute -translate-y-[25%] blur-md scale-15">
        <Img src={maskImage} />
      </div>
      <div className="w-[90%] object-contain  m-auto -mt-[10%] md:-mt-[10%]">
        <Img src={pathsImage} />
      </div>
    </div>
  )
}

const HeaderContent = () => {
  // function handleButtonClick() {
  //   // navigate to "https://www.lyrise.ai/Employer"
  //   window.location.href = 'https://www.lyrise.ai/Employer'
  // }

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden p-5 pt-0">
        <h1 className="font-primary-500 text-3xl capitalize">
          The Right AI Talent for you
        </h1>
        <h3 className="font-secondary pt-2 text-gray-500 text-lg font-semibold">
          Instant Talent Matching, Faster Recruitment Process,
          <br /> Access to a Diverse Talent Pool
        </h3>
        <Link href="/Employer">
          <button
            type="button"
            // onClick={handleButtonClick}
            className="font-secondary w-full p-3 mt-5 rounded-md bg-primary text-white text-lg font-semibold"
          >
            Start your hiring now
          </button>
        </Link>
      </div>
      {/* Bigger than mobile */}
      <div className="hidden md:flex flex-col p-5 absolute top-0 w-full text-center items-center">
        <h1 className="font-primary-500 text-5xl lg:text-6xl font-extrabold capitalize">
          The Perfect AI Talent for you
        </h1>
        <h3 className="text-xl lg:text-2xl font-secondary text-gray-500 mt-6 md:w-[70%] lg:w-[47%]">
          Start working with top AI talents that match your needs to the last
          detail.
        </h3>
        <Link href="/Employer">
          <button
            type="button"
            // onClick={handleButtonClick}
            className="font-secondary w-auto p-3 mt-10 rounded-md bg-primary text-white text-lg hover:translate-x-3 transition-all duration-300 ease-in-out"
          >
            Start hiring now <AiOutlineArrowRight className="inline-block" />
          </button>
        </Link>
      </div>
    </>
  )
}

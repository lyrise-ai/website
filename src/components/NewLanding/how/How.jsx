import React, { useState, useEffect } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'

import paths from '../../../assets/product/how/paths.png'
import macbook1 from '../../../assets/product/how/macbook1.png'

import chatImg from '../../../assets/new-how/chat.png'
import engineerCardImg from '../../../assets/new-how/engineer-card.png'
import rectanglesImg from '../../../assets/new-how/rectangles.png'
import sphereGif from '../../../assets/new-how/sphere.gif'

import Img from '../../Product/Img'
import FadeInOut from '../../Product/FadeInOut'

const sections = [
  {
    id: 1,
    title: '1. Tell us what you need',
    subtitle:
      'Our team will listen to all of your requirements and find the talent that is your perfect fit.',
  },
  {
    id: 2,
    title: '2. We use AI to go through our vetted talent database',
    subtitle:
      'With a wide-yet-niche pool with over 1200+ talents, we will get you a hand-picked shortlist of AI & software engineers superstars for your review that have the exact skill set that you are looking for.',
  },
  // {
  //   id: 3,
  //   title: '2. We use AI to go through our vetted talent database',
  //   subtitle:
  //     'With a wide-yet-niche pool with over 1200+ talents, we will get you a hand-picked shortlist of AI & software engineers superstars for your review that have the exact skill set that you are looking for.',
  // },
  {
    id: 3,
    title: '3. Get Matched & Connected!',
    subtitle:
      "Once you select the talent that best matches your requirements, culture, and values, we'll facilitate introductions to ensure a seamless and stress-free hiring experience.",
  },
]

const options = {
  root: null, // default, use viewport
  rootMargin: '0px 0px -20% 0px',
  threshold: 0.5, // half of item height
}

export default function How() {
  const [ref1, isViewingRef1] = useInView(options)
  const [ref2, isViewingRef2] = useInView(options)
  const [ref3, isViewingRef3] = useInView(options)
  // const [ref4, isViewingRef4] = useInView(options)
  const [previousSectionIndex, setPreviousSectionIndex] = useState(null)
  const [sectionViewing, setSectionViewing] = useState(1)

  useEffect(() => {
    if (isViewingRef1) {
      setPreviousSectionIndex(sectionViewing)
      setSectionViewing(1)
    }
    if (isViewingRef2) {
      setPreviousSectionIndex(sectionViewing)
      setSectionViewing(2)
    }
    if (isViewingRef3) {
      setPreviousSectionIndex(sectionViewing)
      setSectionViewing(3)
    }
    // if (isViewingRef4) {
    //   setSectionViewing(4)
    // }
  }, [isViewingRef1, isViewingRef2, isViewingRef3])

  // logger for section in viwe
  useEffect(() => {
    console.log(sectionViewing)
  }, [sectionViewing])

  return (
    <>
      <div className="lg:hidden">
        <HowSection />
      </div>
      <div className="hidden lg:grid grid-cols-2 h-auto relative">
        <div className="sticky p-30 h-[100px] top-0 mb-[50%] xl:mb-[40%]">
          {sections.map((section, index) => {
            return (
              <FadeInOut show={index === sectionViewing - 1} key={section.id}>
                <HowDesktopSection
                  title={section.title}
                  subtitle={section.subtitle}
                />
              </FadeInOut>
            )
          })}
        </div>
        <div className="grid-start-2 -top-[40vh]x xl:-top-[50vh]x relative">
          <div
            className="bg-white w-[25vw] h-[25vw] sticky p-30 top-1/3 m-auto mt-[25vh] mb-[30%] xl:mb-[20%] rounded-[20px] overflow-hidden"
            style={{
              boxShadow: '0px 11.86106px 23.72213px 0px rgba(0, 34, 158, 0.15)',
            }}
          >
            <AnimatePresence>
              {getContent(sectionViewing, previousSectionIndex)}
            </AnimatePresence>
          </div>
          <div className="h-[60vh] w-full p-30" ref={ref1}></div>
          <div className="h-[100vh] w-full p-30" ref={ref2}></div>
          <div className="h-[100vh] w-full p-30" ref={ref3}></div>
        </div>
      </div>
    </>
  )
}

function Content1({ sectionViewing, previousSectionIndex }) {
  return (
    <ContentSlot
      my_key="6fbb15e0-95b6-4c05-a9d2-a4e57fd190c0"
      sectionViewing={sectionViewing}
      previousSectionIndex={previousSectionIndex}
    >
      <ul className="text-blue-800 mt-[15%] ml-10 w-fit h-fit pl-10 border-[12px] border-white rounded-[20px] bg-[#EFF2FF] font-secondary p-5">
        <li className="list-disc">Job title</li>
        <li className="list-disc">Skills</li>
        <li className="list-disc">Industry</li>
        <li className="list-disc">Use Cases</li>
        <li className="list-disc">Availability</li>
        <li className="list-disc">Seniority</li>
      </ul>
      <Img
        src={rectanglesImg}
        className={`absolute -bottom-40 -right-32 w-full h-full -z-10`}
      />
    </ContentSlot>
  )
}

function Content2({ sectionViewing, previousSectionIndex }) {
  return (
    <ContentSlot
      my_key="c5b6a9c0-90a3-41ad-bb14-970e2776cafb"
      sectionViewing={sectionViewing}
      previousSectionIndex={previousSectionIndex}
    >
      <Img src={chatImg} className="mt-20 w-full h-full -z-10" />
    </ContentSlot>
  )
}
function Content3({ sectionViewing, previousSectionIndex }) {
  return (
    <ContentSlot
      my_key="d5059082-845d-4862-809c-dbd3d71687c6"
      sectionViewing={sectionViewing}
      previousSectionIndex={previousSectionIndex}
    >
      <Img src={sphereGif} className="w-full h-full -z-10" />
    </ContentSlot>
  )
}
function Content4({ sectionViewing, previousSectionIndex }) {
  return (
    <ContentSlot
      my_key="399d7852-7567-4b43-a5ef-cf795e7e5a79"
      sectionViewing={sectionViewing}
      previousSectionIndex={previousSectionIndex}
    >
      <Img src={engineerCardImg} className="w-full h-full -z-10 scale-[0.85]" />
    </ContentSlot>
  )
}

function Content2then3() {
  const [is2, setIs2] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIs2(false)
    }, 1500)
  }, [])

  return is2 ? <Content2 /> : <Content3 />
}

function getContent(sectionViewing, previousSectionIndex) {
  return (
    <>
      {sectionViewing === 1 && (
        <Content1
          sectionViewing={sectionViewing}
          previousSectionIndex={previousSectionIndex}
        />
      )}
      {sectionViewing === 2 && (
        <Content2then3
          sectionViewing={sectionViewing}
          previousSectionIndex={previousSectionIndex}
        />
      )}
      {sectionViewing === 3 && (
        <Content4
          sectionViewing={sectionViewing}
          previousSectionIndex={previousSectionIndex}
        />
      )}
      {sectionViewing === null && (
        <Content1
          sectionViewing={sectionViewing}
          previousSectionIndex={previousSectionIndex}
        />
      )}
    </>
  )
}
function ContentSlot({
  children,
  className,
  my_key,
  delay = 0,
  sectionViewing,
  previousSectionIndex,
}) {
  const direction = previousSectionIndex > sectionViewing ? 'up' : 'down'

  console.log('scrolling', direction)
  console.log('prev', previousSectionIndex, 'curr', sectionViewing)

  return (
    <motion.div
      key={my_key}
      // Reverse the animation direction if necessary
      className={`w-full h-full relative overflow-hidden ${className}`}
      initial={{ y: direction === 'up' ? '-100%' : '100%' }}
      animate={{ y: '0' }}
      exit={{ y: direction === 'up' ? '100%' : '-100%' }}
      transition={{
        duration: 0.7,
        bounce: 0,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

function DesktopImage({ src, mref }) {
  return (
    <div className="h-[100vh] w-full p-30" ref={mref}>
      <Img
        src={src}
        className="h-full w-full object-contain scale-75 lg:scale-90ff xl:scale-100 ml-[5vw] xl:ml-[20%]"
      />
    </div>
  )
}

function HowDesktopSection({ title, subtitle }) {
  return (
    <div className="col-span-1 p-20 pt-[40%] mb-[1400px] fade-in-out">
      <h1 className="hidden md:block font-primary-500 font-semibold text-4xl pb-5">
        {title}
      </h1>
      <p className="hidden md:block font-primary-500 text-2xl text-gray-500 pb-5">
        {subtitle}
      </p>
      <button
        type="button"
        className="flex gap-3 items-center font-primary-500 text-2xl text-primary"
      >
        Learn More <AiOutlineArrowRight />
      </button>
    </div>
  )
}

function HowSection() {
  return (
    <div className="h-auto md:h-[75vh] w-full flex flex-col-reverse gap-8 md:grid grid-cols-2 p-10 md:p-20">
      {/* <PathsBackground /> */}
      <div className="col-span-1 h-full flex flex-col gap-5 justify-center">
        <h1 className="hidden md:block font-primary-500 font-semibold text-4xl">
          A personalized solution that puts your needs first.
        </h1>
        <p className="hidden md:block font-primary-500 text-2xl text-gray-500">
          We love tailoring our solutions to 100% fit your needs. <br /> Our
          team will listen to all of your requirements and find the talent that
          is your perfect fit.
        </p>
        <h1 className="md:hidden font-primary-500 text-4xl mt-3">
          Free Consultation & Gap Analysis
        </h1>
        <p className="md:hidden font-primary-500 text-2xl text-gray-500">
          We love tailored solutions! Let’s discuss your business needs and
          goals, so our team will get all the requirements you are looking for
          to make an informed decision for you.
        </p>
        <button
          type="button"
          className="flex gap-3 items-center font-primary-500 text-2xl text-primary"
        >
          Learn More <AiOutlineArrowRight />
        </button>
      </div>
      {/* <PathsBackground /> */}
      <div className="col-span-1 h-full w-full relative flex">
        <ImageWithBackground src={macbook1} />
      </div>
    </div>
  )
}

function ImageWithBackground({ paths, src, className }) {
  return (
    <>
      <Img
        src={paths}
        alt=""
        className={`w-full object-contain absolute -translate-y-5ff md:top-[20%] lg:top-[10%] xl:-top-5 ${className}`}
      />
      <Img
        src={src}
        alt=""
        className="h-full w-full m-auto object-contain z-50 relative lg:scale-[.85]"
      />
    </>
  )
}

import React, { useState, useEffect } from 'react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useInView } from 'react-intersection-observer'

import paths from '../../assets/product/how/paths.png'
import macbook1 from '../../assets/product/how/macbook1.png'
import macbook2 from '../../assets/product/how/macbook2.png'
import macbook3 from '../../assets/product/how/macbook3.png'
import FadeInOut from './FadeInOut'
import Img from './Img'

const sections = [
  {
    id: 1,
    title: 'Free Consultation & Gap Analysis',
    subtitle:
      'We love tailored solutions! Let’s discuss your business needs and goals, so our team will get all the requirements you are looking for to make an informed decision for you.',
  },
  {
    id: 2,
    title: 'Get the Shortlist',
    subtitle:
      'With a wide-yet-niche pool with over 1200+ talents, we will get you a hand-picked shortlist of AI & software engineers superstars for your review that have the exact skill set that you are looking for.',
  },
  {
    id: 3,
    title: 'Talents Vetting',
    subtitle:
      'Our LyRise experts will then use our comprehensive vetting process to identify the top candidates among our talent pool who meet your specific requirements.',
  },
  {
    id: 4,
    title: 'Get Matched & Connected',
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
  const [ref4, isViewingRef4] = useInView(options)
  const [sectionViewing, setSectionViewing] = useState(1)

  useEffect(() => {
    if (isViewingRef1) {
      setSectionViewing(1)
    }
    if (isViewingRef2) {
      setSectionViewing(2)
    }
    if (isViewingRef3) {
      setSectionViewing(3)
    }
    if (isViewingRef4) {
      setSectionViewing(4)
    }
  }, [isViewingRef1, isViewingRef2, isViewingRef3, isViewingRef4])

  return (
    <>
      <div className="lg:hidden">
        <HowSection />
      </div>
      <div className="hidden lg:grid grid-cols-2 h-auto relative bg-white">
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
        <Img
          src={paths}
          className="sticky right-0 top-[20%] mt-[20%] scale-75 grid-start-2"
        />
        <div className="grid-start-2 -top-[40vh] xl:-top-[50vh] relative h-[280vh] xl:h-[290vh]">
          <DesktopImage src={macbook1} mref={ref1} />
          <DesktopImage src={macbook2} mref={ref2} />
          <DesktopImage src={macbook3} mref={ref3} />
          <DesktopImage src={macbook1} mref={ref4} />
        </div>
        z
      </div>
    </>
  )
}

const DesktopImage = ({ src, mref }) => {
  return (
    <div className="h-[90vh] w-full p-30" ref={mref}>
      <Img
        src={src}
        className="h-full w-full object-contain scale-75 lg:scale-90ff xl:scale-100 ml-[5vw] xl:ml-[20%]"
      />
    </div>
  )
}

const HowDesktopSection = ({ title, subtitle }) => {
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

const HowSection = () => {
  return (
    <div className="h-auto md:h-[75vh] w-full flex flex-col-reverse gap-8 md:grid grid-cols-2 p-10 md:p-20  md:bg-white ">
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

const ImageWithBackground = ({ src, className }) => {
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

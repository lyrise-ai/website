import React from 'react'
import { CgProfile } from 'react-icons/cg'

import newtaxLogo from '../../assets/product/stories/neotax/logo.png'
import newtaxShape from '../../assets/product/stories/neotax/shape.png'
import brimoreLogo from '../../assets/product/stories/brimore/logo.png'
import brimoreShape from '../../assets/product/stories/brimore/shape.png'
import silverbulletLogo from '../../assets/product/stories/silverbullet/logo.png'
import silverbulletShape from '../../assets/product/stories/silverbullet/shape.png'
import LyCarousel from './LyCarousel'
import Img from './Img'

const storiesData = [
  {
    id: 1,
    title: 'Neo.Tax reduced cost of its AI team by 50% with LyRise.',
    subtitle:
      'Scope of product: Automating accounting and taxing reporting using AI (NLP).',
    logo: newtaxLogo,
    shape: newtaxShape,
    descriptive: true,
  },
  {
    id: 2,
    title: 'Brimore saved 50% time hiring with LyRise.',
    subtitle:
      'Scope of work: Refer Data Scientists to work on their social commerce platform.',
    logo: brimoreLogo,
    shape: brimoreShape,
  },
  {
    id: 3,
    title: 'How LyRise helped Silverbullet improve their Al model by 50%.',
    subtitle:
      'Scope of product: Increasing key words matching with context in news articles.',
    logo: silverbulletLogo,
    shape: silverbulletShape,
  },
]

export default function Stories() {
  return (
    <LyCarousel>
      {storiesData.map((story) => (
        <div
          key={story.id}
          className="w-full h-full flex flex-col-reverse gap-8 md:grid grid-cols-2 p-10 md:p-20 max-w-[90%] m-auto"
        >
          <div className="col-span-1 h-full flex flex-col gap-5 justify-center">
            <div className="w-40">
              <Img src={story.logo} />
            </div>
            <h1 className="font-primary-500 text-2xl lg:text-3xl text-primary font-bold">
              {story.title}
            </h1>
            <h3 className="font-primary-500  lg:text-2xl font-extralight text-gray-500">
              {story.subtitle}
            </h3>
            {story.descriptive && (
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-[80%]">
                <ProgressComponent
                  progress="45"
                  title="Affordable"
                  subtitle="Saved 50% of the cost"
                />
                <ProgressComponent progress="15" title="" subtitle="1  week" />
              </div>
            )}
          </div>
          <div className="col-span-1 h-full w-full relative flex justify-center items-center">
            <Img
              src={story.shape}
              className="m-auto object-contain md:absolute"
            />
          </div>
        </div>
      ))}
    </LyCarousel>
  )
}

const ProgressComponent = ({ progress, title, subtitle }) => {
  return (
    <div className="font-secondary font-bold flex-1">
      {title ? (
        <h1 className="mb-2">{title}</h1>
      ) : (
        <>
          <CgProfile className="inline-block mb-2 mr-2 text-primary text-2xl lg:mb-4" />
          <CgProfile className="inline-block mb-2 text-primary text-2xl lg:mb-4" />
        </>
      )}
      <div className="w-full h-6 bg-[#C9CFFF]">
        <div className="h-6 bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <div className="font-primary-500 font-light mt-2 text-smf">
        {subtitle}
      </div>
    </div>
  )
}

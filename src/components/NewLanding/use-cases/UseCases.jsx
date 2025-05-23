import React from 'react'

import { Carousel, carousel } from '@material-tailwind/react'
import Image from 'next/legacy/image'

import healthcare from '../../../assets/hero/icons/healthcare.png'
import manufacturing from '../../../assets/hero/icons/manufacturing.png'
import retail from '../../../assets/hero/icons/retail.png'
import transportation from '../../../assets/hero/icons/transportation.png'
import finance from '../../../assets/hero/icons/finance.png'
import Img from '../../Product/Img'
import { UseCasesCards } from './Card'
import PageSection from '@components/NewLanding/section/PageSection'
import PageSectionTitle from '@components/NewLanding/section/PageSectionTitle'

const cases = [
  {
    id: 0,
    title: 'Healthcare & Life Sciences',
    icon: healthcare,
  },
  {
    id: 1,
    title: 'Finance & Banking',
    icon: finance,
  },
  {
    id: 2,
    title: 'Retail & E-Commerce',
    icon: retail,
  },
  {
    id: 3,
    title: 'Manufacturing & Industry 4.0',
    icon: manufacturing,
  },
  {
    id: 4,
    title: 'Transportation & Logistics',
    icon: transportation,
  },
]

export default function UseCases() {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const ref1 = React.useRef(null)
  const ref2 = React.useRef(null)
  const ref3 = React.useRef(null)
  const ref4 = React.useRef(null)
  const ref5 = React.useRef(null)

  const refs = [ref1, ref2, ref3, ref4, ref5]

  React.useEffect(() => {
    if (refs[activeIndex].current) {
      refs[activeIndex].current.click()
      console.log('clicked', refs[activeIndex].current.click)
    }
  }, [activeIndex])

  return (
    <PageSection className="text-center w-full mt-10 md:mt-32">
      {/* <PageSectionTitle
        subtitle="Industries & Use Cases"
        title="Discover the Industry and Use Cases for your A.I. needs"
      /> */}

      <div className="inline-flex max-sm:w-[90vw] flex-row lg:gap-10 lg:mx-20 xl:mx-52 border-neutral-400 border-b-2 max-md:overflow-x-scroll">
        {cases.map((item) => (
          <Tab
            key={item.id}
            title={item.title}
            icon={item.icon}
            onClick={() => setActiveIndex(item.id)}
            isActive={activeIndex === item.id}
          />
        ))}
      </div>

      <Carousel
        navigation={({ setActiveIndex }) =>
          cases.map((c) => {
            return (
              <button
                type="button"
                key={c.id}
                className="hidden"
                ref={refs[c.id]}
                onClick={() => setActiveIndex(Number(c.id))}
              />
            )
          })
        }
        nextArrow={() => null}
        prevArrow={() => null}
        className="m-auto rounded-xl h-auto w-full overflow-hidden"
        loop
      >
        {UseCasesCards}
      </Carousel>
    </PageSection>
  )
}

const Tab = ({ title, icon, onClick, isActive }) => {
  return (
    <div
      className={'responsive-custom-rounded px-5 py-2 min-h-[12vh] cursor-pointer flex flex-col gap-3 justify-center transition-all flex-1 border-b-[3px] lg:border-2 border-transparent '.concat(
        isActive ? '!border-primary bg-[#F7F9FF]' : '',
      )}
      onClick={onClick}
    >
      <Image
        src={icon}
        objectFit="contain"
        width={40}
        className={isActive ? 'scale-75' : 'scale-75 grayscale opacity-80'}
      />
      <div
        className={
          isActive
            ? 'text-[1.1rem] font-semibold text-blue-500'
            : 'text-[1.1rem] font-semibold text-neutral-500'
        }
      >
        {title}
      </div>
    </div>
  )
}

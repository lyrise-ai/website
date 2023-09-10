import React from 'react'

import { Carousel, carousel } from '@material-tailwind/react'
import Image from 'next/image'

import healthcare from '../../../assets/hero/icons/healthcare.png'
import manufacturing from '../../../assets/hero/icons/manufacturing.png'
import retail from '../../../assets/hero/icons/retail.png'
import transportation from '../../../assets/hero/icons/transportation.png'
import finance from '../../../assets/hero/icons/finance.png'

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
    refs[activeIndex].current.click()

    console.log('clicked', refs[activeIndex].current.click)
  }, [activeIndex])

  return (
    <div className="text-center w-full">
      <h3 className="text-neutral-500 font-secondary mb-3">
        Industries & Use Cases
      </h3>
      <h1 className="text-4xl max-w-[500px] m-auto font-semibold mb-10">
        Discover the Industry and Use Cases for your A.I. needs
      </h1>

      <div className="flex flex-row gap-4">
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
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-5 md:bottom-[10%] left-1/2 md:left-[20%] lg:left-[15%] xl:left-[12%] z-50 flex -translate-x-2/4 gap-4">
            {[...Array(length).keys()].map((i) => {
              return (
                <button
                  type="button"
                  key={i}
                  className="hidden"
                  ref={refs[i]}
                  onClick={() => setActiveIndex(i)}
                />

              )
            })}
          </div>
        )}
        className="m-auto rounded-xl h-auto md:h-[75vh] w-full overflow-hidden md:bg-white"
        loop
      >
        <div>Hello world 1</div>
        <div>Hello world 2</div>
        <div>Hello world 3</div>
        <div>Hello world 4</div>
        <div>Hello world 5</div>
      </Carousel>
    </div>
  )
}

const Tab = ({ title, icon, onClick, isActive }) => {
  return (
    <div
      className={'rounded-lg px-5 flex-1 '.concat(
        isActive ? 'border border-primary' : '',
      )}
      onClick={onClick}
    >
      <Image src={icon} width={20} height={20} objectFit="cover" />
      <div className="text-sm">{title}</div>
    </div>
  )
}

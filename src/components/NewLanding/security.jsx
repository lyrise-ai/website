import React, { useState, useEffect } from 'react'
import Image from 'next/legacy/image'

import first from '/src/assets/security/1.jpeg'
import second from '/src/assets/security/2.jpeg'
import third from '/src/assets/security/3.jpeg'
import { useMediaQuery } from '@mui/material'
import { LYRISEAI_PRODUCT_URL } from '../../constants/main'
import PageSection from '@components/NewLanding/section/PageSection'
import PageSectionTitle from '@components/NewLanding/section/PageSectionTitle'

const toBgColor = {
  0: ' bg-[#5277FF]',
  1: ' bg-[#2ED3B7]',
  2: ' bg-[#2CE]',
}

const items = [
  {
    title: 'Privacy Preservation',
    subtitle: (
      <span>
        We operate under a zero-trust architecture. The evolving{' '}
        <a
          href="https://www.ibm.com/products/hyper-protect-virtual-servers"
          className="underline"
        >
          IBM Hyper Protect Platform
        </a>{' '}
        ensures your data security, privacy, and sovereignty.
      </span>
    ),
    imgSrc: first,
  },
  {
    title: 'Confidential Lifecycle',
    subtitle:
      'We utilize IBM’s Secure Service Container technology to maintain your data integrity throughout its journey.',
    imgSrc: second,
  },
  {
    title: 'Regulatory Compliance',
    subtitle:
      'Adhere to GDPR, HIPAA, and industry standards for comprehensive compliance.',
    // 'We ensure full compliance with GDPR, HIPAA, and all relevant industry standards, maintaining the highest level of data protection and regulatory adherence.',
    imgSrc: third,
  },
]

const findElse = {
  0: [1, 2],
  1: [0, 2],
  2: [0, 1],
}

const content = {
  subheading: 'Data Security & Infrastructure',
  heading: 'Elevate Your Data Security with IBM Hyper Protect Infrastructure',
}

function Security() {
  const [active, setActive] = useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) return <MobileVersion active={active} setActive={setActive} />

  return (
    <PageSection className="text-center w-full mt-20">
      <PageSectionTitle title={content.heading} subtitle={content.subheading} />

      <div className="md:grid gap-5 grid-cols-4 max-w-[1200px] m-auto">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className={
              (active === item
                ? 'col-span-2 max-w-[100%]'
                : 'col-span-1 max-w-[150%] cursor-pointer' + toBgColor[item]) +
              ' max-h-[30vh] h-[300px] transition-all rounded-xl max-md:m-3'
            }
            onClick={() => setActive(item)}
          >
            {active === item ? (
              <div
                className="grid grid-cols-2 gap-5 rounded-lg border-[4px] border-white bg-[#EFF2FF] p-3 h-full w-full"
                style={{ boxShadow: '0px 9px 18px 0px rgba(0, 34, 158, 0.15)' }}
              >
                <div className="text-left flex-1 flex flex-col justify-between">
                  <div className="text-sm md:text-[1rem] font-semibold font-secondary my-1 lg:my-3">
                    {items[item].title}
                  </div>
                  <div className="text-xs md:text-[1rem] font-secondary text-neutral-500 mb-3">
                    {items[item].subtitle}
                  </div>
                  <button
                    className="bg-blue-500 p-3 py-2 text-[1rem] font-secondary text-white font-bold rounded-md w-fit"
                    type="button"
                    onClick={() => {
                      window.open(LYRISEAI_PRODUCT_URL + 'signup', '_blank')
                    }}
                  >
                    Get Started
                  </button>
                </div>
                <Image src={items[item].imgSrc} objectFit="cover" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <p className="text-center text-white font-semibold text-3xl font-primary">
                  {items[item].title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </PageSection>
  )
}

export default Security

function MobileVersion({ active, setActive }) {
  console.log('rendering mobile version', active)
  return (
    <PageSection className="text-center w-full">
      <PageSectionTitle title={content.heading} subtitle={content.subheading} />

      {/* active item */}
      <div
        key={active}
        className={
          'col-span-2 max-w-[100%]' +
          ' max-h-[30vh] h-[300px] transition-all rounded-xl max-md:m-3'
        }
        onClick={() => setActive(active)}
      >
        <div
          className="grid grid-cols-2 gap-5 rounded-lg border-[4px] border-white bg-[#EFF2FF] p-3 h-full w-full"
          style={{ boxShadow: '0px 9px 18px 0px rgba(0, 34, 158, 0.15)' }}
        >
          <div className="text-left flex-1 flex flex-col justify-between">
            <div className="text-sm md:text-[1rem] font-semibold font-secondary my-1 lg:my-3">
              {items[active].title}
            </div>
            <div className="text-xs md:text-[1rem] font-secondary text-neutral-500 mb-3">
              {items[active].subtitle}
            </div>
            <button
              className="bg-blue-500 p-3 py-2 text-[1rem] font-secondary text-white font-bold rounded-md w-fit"
              type="button"
              onClick={() => {
                window.open(LYRISEAI_PRODUCT_URL + 'signup', '_blank')
              }}
            >
              Get Started
            </button>
          </div>
          <Image
            src={items[active].imgSrc}
            objectFit="cover"
            width={200}
            height={200}
          />
        </div>
      </div>
      {/* other items */}
      <div className="flex gap-[2vw] m-3">
        {findElse[active].map((item) => (
          <div
            key={item}
            className={
              'col-span-1 w-[47vw] h-[47vw] cursor-pointer' +
              toBgColor[item] +
              ' max-h-[30vh]  transition-all rounded-xl'
            }
            onClick={() => setActive(item)}
          >
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-center text-white font-semibold text-xl font-primary">
                {items[item].title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  )
}

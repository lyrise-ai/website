import React, { useEffect, useState } from 'react'
import { scrollIntoView } from '../../../../utilities/helpers'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import AuthorBox from '../BlogHeader/AuthorBox'

const sideBarElements = [
  {
    title: 'Introduction',
    link: 'intro',
  },
  {
    title: 'Software and tools',
    link: 'section2',
  },
  {
    title: 'Other resources',
    link: 'section3',
  },
  {
    title: 'Conclusion',
    link: 'section4',
  },
]

function FixedDetailsSideBar() {
  const [visibleSections, setVisibleSections] = useState({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleSections = {}
        entries.forEach((entry) => {
          newVisibleSections[entry.target.id] = entry.isIntersecting
        })
        setVisibleSections((prevState) => ({
          ...prevState,
          ...newVisibleSections,
        }))
      },
      {
        root: null, // Observing the viewport
        threshold: 0.3, // Trigger when 10% of the element is visible
      },
    )

    // Observe each section
    sideBarElements.forEach(({ link }) => {
      const element = document.getElementById(link)
      if (element) observer.observe(element)
    })

    // Cleanup on component unmount
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sticky h-fit top-[50px]  pe-8 hidden lg:block">
      <div className="flex flex-col gap-5 border-t border-b border-[#EAECF0] py-[32px] ">
        <h3 className="text-[24px] text-[#5277FF] font-[600] leading-6">
          Table of contents
        </h3>
        <div className="flex flex-col gap-6">
          {sideBarElements.map(({ title, link }) => (
            <div
              key={title}
              onClick={() => scrollIntoView(link)}
              className="flex justify-between items-center cursor-pointer"
            >
              <p
                className={`text-[#475467] text-[16px] leading-[25.6px] cursor-pointer underline ${
                  visibleSections[link] ? 'font-[700]' : 'font-[400]'
                }`}
              >
                {title}
              </p>
              <KeyboardArrowRightRoundedIcon
                sx={{ color: '#475467', width: '24px', height: '24px' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5  border-b border-[#EAECF0] py-[30px]">
        <h3 className="text-[24px] text-[#5277FF] font-[600] leading-6">
          Author
        </h3>
        <AuthorBox />
      </div>
    </div>
  )
}

export default FixedDetailsSideBar

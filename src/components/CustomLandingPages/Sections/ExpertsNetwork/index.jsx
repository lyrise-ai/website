import React, { useContext } from 'react'
import useSectionsContent from '../../../../hooks/useSectionsContent'
import ExpertCard from './ExpertCard'
import { PageBuilderContext } from '../../../../context/PageBuilderContext'

function ExpertsNetwork() {
  const { siteContent } = useContext(PageBuilderContext)
  const { getContent } = useSectionsContent(siteContent)
  const section5Content = getContent('Section5')
  const { title, subtitle, experts } = section5Content || {}

  return (
    <>
      {section5Content && (
        <section id="Section5" className="pb-12">
          <div className="container flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-3 font-space-grotesk text-[18px] lg:text-[20px] xl:text-[24px] text-white">
                <span className="text-[#094BF6]">{'['}</span>
                <span>{subtitle}</span>
                <span className="text-[#094BF6]">{']'}</span>
              </div>
              <h2 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#F7F9FF] font-space-grotesk font-[700] text-[32px] lg:text-[40px] xl:text-[50px]">
                {title}
              </h2>
            </div>
            <ul className="w-full flex flex-wrap items-center justify-center gap-6 px-2 md:px-0">
              {experts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}

export default ExpertsNetwork

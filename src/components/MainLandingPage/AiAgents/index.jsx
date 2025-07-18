import React from 'react'
import { useMediaQuery } from '@mui/material'
import {
  AttachMoney as AttachMoneyIcon,
  Balance as BalanceIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'
import { WaitlistModal } from '../OurGuarantee/WaitlistModal'

const iconComponents = {
  finance: AttachMoneyIcon,
  legal: BalanceIcon,
  hr: PeopleIcon,
  sales: TrendingUpIcon,
}

const content = {
  title: 'AI Agent Customization',
  subtitle:
    'After the roadmap, we implement the most impactful automation flows using custom AI agents. These agents reduce manual effort across operations—legal, finance, HR, sales, and others.',
  cards: [
    {
      title: 'Finance AI Agent',
      description:
        'AI to manage your financial statements and all your company finances!',
      icon: 'finance',
    },
    {
      title: 'Legal AI Agent',
      description:
        'AI to generate contracts, adhere to policies, and manage conflict of interest.',
      icon: 'legal',
    },
    {
      title: 'HR AI Agent',
      description: 'Talent acquisition and HR assistance.',
      icon: 'hr',
    },
    {
      title: 'Sales AI Agent',
      description:
        'Generates leads, taylors messaging to the profile of the lead, then sends emails & Linkedin messages to book meetings.',
      icon: 'sales',
    },
  ],
}

const AiAgentCard = ({ title, description, icon }) => {
  const IconComponent = iconComponents[icon]

  return (
    <div className="bg-gray-100 rounded-[20px] border-2 border-[#c2c2c2] p-6 flex flex-col items-center text-center space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Icon Circle */}
      <div className="w-16 h-16 bg-gray-200  rounded-full flex items-center justify-center">
        <div className="w-12 h-12 bg-[#000000] rounded-full flex items-center justify-center">
          <IconComponent className="text-white" sx={{ fontSize: 28 }} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[#000000] font-outfit font-[600] text-[20px] md:text-[32px] leading-[120%]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#666666] font-outfit font-[400] text-[16px] md:text-[18px] leading-[140%] ">
        {description}
      </p>
    </div>
  )
}

function AiAgents() {
  const { title, subtitle, cards } = content
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <section className="bg-[#F8F9FA] py-16 ">
      <div className="w-full flex flex-col gap-12 px-5 xl:px-[11vw]">
        {/* Header Section */}
        <div className="flex flex-col gap-3 md:gap-7 text-center md:text-left">
          <div className="flex flex-col gap-2">
            {/* Title */}
            <h2 className="text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[32px] lg:text-[40px] leading-[120%]">
              {title}
            </h2>
            {/* Subtitle */}
          </div>
          <p className="text-[#3f3f3f] font-outfit font-[400] text-[16px] md:text-[20px] lg:text-[24px] leading-[110%]">
            {subtitle}
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 ">
          {cards.map((card, index) => (
            <AiAgentCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
        <div className="rounded-[16px] bg-[#000000] p-3 px-[5vw] w-fit mx-auto">
          <div className="text-white font-outfit font-[400] text-[18px] md:text-[20px] lg:text-[28px] leading-[110%] ">
            <span className="inline">
              <WaitlistModal>
                Got an AI Agent Idea?{' '}
                <span className=" font-medium cursor-pointer">
                  <b> Let&apos;s Build It!</b>
                </span>
              </WaitlistModal>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AiAgents

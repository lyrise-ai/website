import React, { useContext } from 'react'
import ExpertCard from './ExpertCard'

const content = {
  title: 'LyRise AI Experts',
  subtitle: 'OurAI Experts Network',
  experts: [
    {
      id: 'loay-amin',
      name: 'Loay Amin',
      title: 'AI Solution Architect',
      avatar: 'loay-amin.webp',
      companies: [
        {
          id: 'pwc',
          name: 'PwC',
          logo: 'pwc.png',
        },
        {
          id: 'udacity',
          name: 'Udacity',
          logo: 'udacity.png',
        },
      ],
    },
    {
      id: 'karim-tawfik',
      name: 'Karim Tawfik',
      title: 'Co-Founder & CTO',
      avatar: 'karim-tawfik.webp',
      companies: [
        {
          id: 'sympl',
          name: 'Sympl',
          logo: 'sympl.png',
        },
        {
          id: 'visa',
          name: 'Visa',
          logo: 'visa.png',
        },
      ],
    },
    {
      id: 'ahmed-samir-roshdy',
      name: 'Ahmed Samir Roshdy',
      title: 'Data Science Expert',
      avatar: 'ahmed-samir-roshdy.webp',
      companies: [
        {
          id: 'vodafone',
          name: 'Vodafone',
          logo: 'vodafone.png',
        },
      ],
    },
    {
      id: 'jonathan-hodges',
      name: 'Jonathan Hodges',
      title: 'Generative AI Expert',
      avatar: 'jonathan-hodges.webp',
      companies: [
        {
          id: 'userpilot',
          name: 'Userpilot',
          logo: 'userpilot.png',
        },
      ],
    },
    {
      id: 'omar-kamal',
      name: 'Omar Kamal',
      title: 'Data Science Expert',
      avatar: 'omar-kamal.webp',
      companies: [
        {
          id: 'procter-&-gamble',
          name: 'Procter & Gamble',
          logo: 'p&g.png',
        },
        {
          id: 'career-foundry',
          name: 'Career Foundry',
          logo: 'cf.png',
        },
      ],
    },
  ],
}

function OurExperts() {
  const { title, subtitle, experts } = content || {}

  return (
    <>
      <section id="Section5" className="pb-12">
        <div className="container flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <h3 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[30px] lg:text-[40px] ">
              {title}
            </h3>
          </div>
          <ul className="w-full flex flex-wrap items-center justify-center gap-6 px-2 md:px-0">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default OurExperts

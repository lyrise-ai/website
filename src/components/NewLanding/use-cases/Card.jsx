import Img from '../../Product/Img'

import healthcareImg from '/src/assets/use-cases/images/healthcare.png'
import manufacturingImg from '/src/assets/use-cases/images/manufacturing.png'
import retailImg from '/src/assets/use-cases/images/retail.png'
import transportationImg from '/src/assets/use-cases/images/transportation.png'
import financeImg from '/src/assets/use-cases/images/finance.png'

// healthcare
import healthCare1 from '/src/assets/hero/icons/healthcare/1.png'
import healthCare2 from '/src/assets/hero/icons/healthcare/2.png'
import healthCare3 from '/src/assets/hero/icons/healthcare/3.png'
import healthCare4 from '/src/assets/hero/icons/healthcare/4.png'
import healthCare5 from '/src/assets/hero/icons/healthcare/5.png'
import Image from 'next/image'
import { ArrowRight } from '@mui/icons-material'

// // manufacturing
// import manufacturing1 from '/src/assets/hero/icons/healthcare/1.svg'
// import manufacturing2 from '/src/assets/hero/icons/healthcare/2.svg'
// import manufacturing3 from '/src/assets/hero/icons/healthcare/3.svg'
// import manufacturing4 from '/src/assets/hero/icons/healthcare/4.svg'

// // retail
// import retail1 from '/src/assets/hero/icons/healthcare/1.svg'
// import retail2 from '/src/assets/hero/icons/healthcare/2.svg'
// import retail3 from '/src/assets/hero/icons/healthcare/3.svg'
// import retail4 from '/src/assets/hero/icons/healthcare/4.svg'

// // transportation
// import transportation1 from '/src/assets/hero/icons/healthcare/1.svg'
// import transportation2 from '/src/assets/hero/icons/healthcare/2.svg'
// import transportation3 from '/src/assets/hero/icons/healthcare/3.svg'
// import transportation4 from '/src/assets/hero/icons/healthcare/4.svg'

// // finance
// import finance1 from '/src/assets/hero/icons/healthcare/1.svg'
// import finance2 from '/src/assets/hero/icons/healthcare/2.svg'
// import finance3 from '/src/assets/hero/icons/healthcare/3.svg'
// import finance4 from '/src/assets/hero/icons/healthcare/4.svg'

const cases = [
  {
    id: 0,
    title: 'healthcare',
    imgSrc: healthcareImg,
    items: [
      {
        id: 0,
        title: 'Medical Diagnosis',
        subtitle:
          'Picture a future where diagnoses are 20% more accurate, leading to timely treatments and brighter outcomes.',
        icon: healthCare1,
      },
      {
        id: 1,
        title: 'Drug Discovery',
        subtitle:
          'Journey into drug development with a 30% shorter timeline, delivering life-saving medications faster than ever.',
        icon: healthCare2,
      },
      {
        id: 2,
        title: 'Personalized Treatment',
        subtitle:
          'Experience a shift in healthcare as AI-driven treatment plans reduce hospital readmissions by 15%.',
        icon: healthCare3,
      },
      {
        id: 3,
        title: 'Remote Monitoring',
        subtitle:
          'Witness IoT and AI collaboration lower hospitalization rates by 25%, enhancing care while cutting costs.',
        icon: healthCare4,
      },
      {
        id: 4,
        title: 'Predictive Analytics',
        subtitle:
          'Step into flu outbreak prediction accuracy of 85%, optimizing resources and saving lives.',
        icon: healthCare5,
      },
    ],
  },
  {
    id: 1,
    title: 'finance',
    imgSrc: financeImg,
    items: [
      {
        id: 0,
        title: 'Fraud Detection',
        subtitle:
          'Uncover the power of AI as fraudulent transactions decrease by 40%, safeguarding financial assets.',
        icon: healthCare1,
      },
      {
        id: 1,
        title: 'Algorithmic Trading',
        subtitle:
          'Join a world where AI algorithms outshine human traders, increasing returns by an impressive 10%.',
        icon: healthCare2,
      },
      {
        id: 2,
        title: 'Customer Service Chatbots',
        subtitle:
          'Immerse yourself in seamless customer service, with AI chatbots resolving 80% of inquiries instantly.',
        icon: healthCare3,
      },
      {
        id: 3,
        title: 'Credit Scoring',
        subtitle:
          'Witness a 20% drop in default rates, leading to enhanced profitability and financial stability.',
        icon: healthCare4,
      },
      {
        id: 4,
        title: 'Risk Management',
        subtitle:
          'Experience the power of AI models reducing credit risk by 15%, creating a new era of wise investments ',
        icon: healthCare5,
      },
    ],
  },
  {
    id: 2,
    title: 'retail',
    imgSrc: retailImg,
    items: [
      {
        id: 0,
        title: 'Personalized Recommendations',
        subtitle:
          'Embark on a shopping journey where AI recommendations drive a 25% surge in sales and engagement.',
        icon: healthCare1,
      },
      {
        id: 1,
        title: 'Inventory Management',
        subtitle:
          'Explore the world of AI-optimized inventory, cutting carrying costs by 30% and elevating profits.',
        icon: healthCare2,
      },
      {
        id: 2,
        title: 'Dynamic Pricing',
        subtitle:
          'See real-time pricing adjustments boost revenue by 15%, crafting a smarter shopping experience',
        icon: healthCare3,
      },
      {
        id: 3,
        title: 'Supply Chain Optimization',
        subtitle:
          'Dive into a realm of AI-enhanced supply chains, reducing costs by 20% and elevating efficiency',
        icon: healthCare4,
      },
      {
        id: 4,
        title: 'Visual Search',
        subtitle:
          'Witness AI-enabled visual search ignite a 35% rise in conversion rates, amplifying revenue growth. ',
        icon: healthCare5,
      },
    ],
  },
  {
    id: 3,
    title: 'manufacturing',
    imgSrc: manufacturingImg,
    items: [
      {
        id: 0,
        title: 'Predictive Maintenance',
        subtitle:
          'Imagine a factory where predictive AI maintenance slashes costs by 25% and boosts equipment uptime by 20%.',
        icon: healthCare1,
      },
      {
        id: 1,
        title: 'Quality Control',
        subtitle:
          'Step into a manufacturing landscape where AI-improved quality control reduces defects by 30% amplifying reliability.',
        icon: healthCare2,
      },
      {
        id: 2,
        title: 'Process Optimization',
        subtitle:
          'Experience AI-optimized processes that boost efficiency by 15%, resulting in remarkable production gains.',
        icon: healthCare3,
      },
      {
        id: 3,
        title: 'Supply Chain Visibility',
        subtitle:
          'Journey through AI-enhanced supply chains that reduce excess inventory by 20%, driving cost reductions',
        icon: healthCare4,
      },
      {
        id: 4,
        title: 'Energy Management',
        subtitle:
          'Discover the power of AI-optimized energy use, slashing costs by 10% and contributing to savings.',
        icon: healthCare5,
      },
    ],
  },
  {
    id: 4,
    title: 'transportation',
    imgSrc: transportationImg,
    items: [
      {
        id: 0,
        title: 'Autonomous Vehicles',
        subtitle:
          'Envision roads with 50% fewer accidents, cutting insurance costs and ensuring safer travel.',
        icon: healthCare1,
      },
      {
        id: 1,
        title: 'Route Optimization',
        subtitle:
          'Join a journey where AI-optimized routes lower fuel costs by 15% and delivery times by 20%, driving efficiency.',
        icon: healthCare2,
      },
      {
        id: 2,
        title: 'Demand Forecasting',
        subtitle:
          'Witness AI-driven demand forecasting reducing inventory costs by 25%, creating a seamless supply chain.',
        icon: healthCare3,
      },
      {
        id: 3,
        title: 'Fleet Management',
        subtitle:
          'Experience AI-enabled fleet management lowering maintenance costs by 20% and boosting driver productivity.',
        icon: healthCare4,
      },
      {
        id: 4,
        title: 'Smart Traffic Management',
        subtitle:
          'Enter a world with 30% less traffic congestion, saving time, fuel, and boosting overall efficiency.',
        icon: healthCare5,
      },
    ],
  },
]

// export default UseCasesCards
export const UseCasesCards = cases.map((_case) => {
  return (
    <div className="flex flex-row gap-10 p-3 lg:p-10 lg:max-w-[1440px] w-[95vw] lg:w-[80vw] m-auto">
      <div className="flex-1 border-[3px] lg:border-2 border-primary flex flex-col bg-[#F7F9FF] gap-6 p-5 rounded-2xl lg:rounded-xl">
        {_case.items.map((item) => {
          return (
            <div className="flex-1 flex flex-row gap-5">
              <div className="flex justify-center items-center w-12 h-12 lg:w-20 lg:h-20 flex-shrink-0 bg-[#D1DBFF] border-[6px] border-[#EFF2FF] rounded-full">
                <Image
                  src={item.icon}
                  // className="w-10 h-10 object-contain scale-125 flext items-center justify-center"
                  alt="use case icon"
                  width={30}
                  height={30}
                />
              </div>
              <div className="text-left flex flex-col justify-center flex-grow-0">
                <div className="font-secondary text-black font-semibold text-sm md:text-xs lg:text-lg mb-1">
                  {item.title}
                </div>
                <div className="font-secondary text-gray-500 text-sm md:text-xs lg:text-[1.05rem] leading-5">
                  {item.subtitle}
                </div>
              </div>
            </div>
          )
        })}
        {/* <div className="flex gap-2 text-primary font-semibold font-secondary text-sm cursor-pointer">
          View all Use Cases{' '}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.1665 9.99996H15.8332M15.8332 9.99996L9.99984 4.16663M15.8332 9.99996L9.99984 15.8333"
              stroke="#0033EB"
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div> */}
      </div>
      <div className="hidden lg:block">
        <Image src={_case.imgSrc} className="rounded-xl flex-1" />
      </div>
    </div>
  )
})

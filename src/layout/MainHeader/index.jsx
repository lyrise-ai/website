import React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import Logo from '../../assets/rebranding/logo_black.svg'
import { scrollToSection } from '../../utilities/helpers'
import MainHeaderMobile from './MainHeaderMobile'
import { useRouter } from 'next/navigation'
import styles from './styles.module.css'
import { WaitlistModal } from '../../components/MainLandingPage/OurGuarantee/WaitlistModal'

const BUTTONS = [
  {
    id: 'btn_0',
    label: 'Get your AI Agent',
    path: 'https://calendly.com/elena-lyrise/30min',
  },
]

const NAVIGATIONS = [
  // {
  //   id: 'nav_0',
  //   label: 'Our Products',
  //   path: '/',
  //   isPage: false,
  // },
  {
    id: 'nav_1',
    label: 'Our Blog',
    path: 'https://blog.lyrise.ai/',
    isPage: false,
  },
  // {
  //   id: 'nav_2',
  //   label: 'Who are we?',
  //   path: '/about',
  //   isPage: true,
  // },

  // {
  //   id: 'nav_3',
  //   label: 'AI Accelerator',
  //   path: '/accelerator',
  //   isPage: true,
  // },
]

export default function MainHeader() {
  const router = useRouter()
  const navigate = (path) => {
    router.push(path)
  }
  return (
    <header className="py-4 mt-3 px-10  mb-10 lg:mb-0">
      <div
        className={`custom-container flex items-center justify-between gap-4 py-3 ${styles.navbar}`}
      >
        <div className="h-[36px]">
          <Image
            src={Logo}
            alt="LyRise AI"
            width={120}
            height={40}
            objectFit="contain"
          />
        </div>

        <ul className="hidden lg:flex items-center gap-10 font-outfit font-normal text-new-black">
          {NAVIGATIONS.map(({ label, path, isPage }) => (
            <li key={path}>
              <div
                onClick={() => {
                  if (isPage) {
                    navigate(path)
                  } else {
                    scrollToSection(path)
                  }
                }}
                className={`text-[20px] font-[600] leading-[19.2px] inline-block relative after:absolute after:start-1/2 after:-translate-x-1/2 after:bottom-[1px] after:h-[1px] after:w-full after:transition-transform after:scale-0 hover:after:scale-100 after:rounded-full cursor-pointer font-outfit ${
                  label === 'AI Accelerator'
                    ? 'text-[#DE0000] after:bg-[#DE0000] '
                    : 'text-new-black after:bg-new-black '
                }`}
              >
                {label}
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          {BUTTONS.map(({ label, path }) => (
            <WaitlistModal>
              <div
                key={path}
                className="cursor-pointer group relative text-[22px] font-[400] flex items-center justify-center gap-2 p-2 px-5 leading-[24px]  rounded-[30px] text-white bg-new-black transition-colors hover:bg-new-black/85 font-outfit"
              >
                {label}
              </div>
            </WaitlistModal>
          ))}
        </div>

        <MainHeaderMobile navigation={NAVIGATIONS} buttons={BUTTONS} />
      </div>
    </header>
  )
}

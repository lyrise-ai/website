import React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import HeaderMobile from './HeaderMobile'
import Logo from '../../../assets/full-Logo-white.svg'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import useSectionsContent from '../../../hooks/useSectionsContent'
import { scrollToSection } from '../../../utilities/helpers'

const BUTTONS = [
  {
    id: 'btn_0',
    label: 'Register Now',
    path: 'https://lyrai-chat.lyrise.ai/signup',
  },
]

export default function Header({ siteContent }) {
  const { getMetadata } = useSectionsContent(siteContent)
  const { navbar } = getMetadata()

  const NAVIGATIONS = navbar.map((item) => ({
    id: item.id,
    label: item.name,
    path: item.url,
  }))

  return (
    <header className="py-4 mt-3 px-2">
      <div className="custom-container flex items-center justify-between gap-4 shadow-[0px_0px_4px_0px_#2957FF] py-3 rounded-[4px]">
        <Link href="/" title="LyRise">
          <div className="pl-2 h-[36px]">
            <Image
              src={Logo}
              alt="LyRise AI"
              width={120}
              height={40}
              objectFit="contain"
            />
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-4 font-space-grotesk font-normal text-[#ffffff]">
          {NAVIGATIONS.map(({ label, path }) => (
            <li key={path}>
              <div
                onClick={() => scrollToSection(path)}
                className="text-[16px] leading-[19.2px] inline-block relative after:absolute after:start-1/2 after:-translate-x-1/2 after:bottom-[1px] after:h-[1px] after:w-full after:transition-transform after:scale-0 hover:after:scale-100 after:rounded-full after:bg-[#ffffff] cursor-pointer"
              >
                {label}
              </div>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          {BUTTONS.map(({ label, path }) => (
            <a
              key={path}
              href={path}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative text-[14px] flex items-center gap-2 px-4 py-2 h-[36px] rounded-[4px] text-white bg-main transition-colors hover:bg-main/90"
            >
              {label}
              <ArrowRightAltIcon className="transition-transform group-hover:translate-x-1 !size-6" />
            </a>
          ))}
        </div>

        <HeaderMobile navigation={NAVIGATIONS} buttons={BUTTONS} />
      </div>
    </header>
  )
}

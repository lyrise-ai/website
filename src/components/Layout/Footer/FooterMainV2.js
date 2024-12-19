import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { Divider, Grid, useMediaQuery } from '@mui/material'
import React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {
  footerLinksOne,
  footerLinksTwo,
  footerLinksThree,
  headingEnum,
  footerLinks,
  footerLinksFour,
} from './FooterData'
import Logo from '../../../assets/LyRiseLogo.png'
import FooterColumnV2 from './FooterColumnV2'
import ArrowButton from '../../Buttons/ArrowButton'

const FooterMainV2 = ({ isTalent }) => {
  const mobile = useMediaQuery('(max-width: 887px)')
  return (
    <footer className="bg-white p-[60px_10%] ">
      <div className=" flex justify-between gap-4 ">
        <div className="flex gap-[83px] flex-wrap">
          {/* first column */}
          <FooterColumnV2
            heading={headingEnum.EMPLOYERS}
            links={footerLinksOne}
          />
          {/* 2nd column */}
          <FooterColumnV2
            heading={headingEnum.TALENTS}
            links={footerLinksTwo}
          />
          {/* 3rd column - Form */}
          <FooterColumnV2
            heading={headingEnum.COMPANY}
            links={footerLinksThree}
          />
        </div>

        {/* 4th column - Form */}
        <div className="flex flex-col gap-[60px]">
          <div className="rounded-lg bg-white shadow-[0px_6px_12px_0px_#00229E1C] flex flex-col gap-4 p-6 justify-center">
            <div className="text-[24px] font-semibold leading-[24px]">
              Find your AI Talent Now!
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-normal text-[16px] leading-[25.6px] text-[#475467]">
                Enter your email
              </span>
              <input
                id="entered-email"
                className="md:w-[360px] text-[16px] border border-[#d5d5d5] rounded-lg p-2 font-normal outline-none"
                placeholder="example@email.com"
                name="email"
                type="email"
              />
            </div>

            <div className="w-full">
              <Link
                href="https://lyrai-chat.lyrise.ai/signup"
                passHref
                target={'_blank'}
                rel="noopener noreferrer"
              >
                <ArrowButton type="submit" variant="default" className="w-full">
                  Hire Now!
                </ArrowButton>
              </Link>
            </div>
          </div>
          {/* logo */}
          <div className="flex justify-end w-full">
            <Image src={Logo} />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterMainV2

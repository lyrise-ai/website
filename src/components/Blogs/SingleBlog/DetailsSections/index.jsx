import { Divider } from '@mui/material'
import React from 'react'
import Intro from './Intro'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'
import AuthorBox from '../BlogHeader/AuthorBox'

function DetailsSections() {
  return (
    <div className="flex flex-col gap-7 xl:pe-[13%]">
      <p className="text-[#475467] text-[16px] sm:text-[20px] font-[400] leading-[25.6px] sm:leading-[32px] ">
        Neural networks are a fascinating subset of artificial intelligence that
        mimic the way human brains operate. They consist of interconnected
        nodes, or neurons, that process data in layers.
      </p>
      <Divider sx={{ borderColor: '#EAECF0' }} />
      <Intro />
      <Section2 />
      <Section3 />
      <Section4 />
      <div className="flex flex-col gap-5 border-t border-b border-[#EAECF0] py-[30px] lg:hidden">
        <h3 className="text-[24px] text-[#5277FF] font-[600] leading-6">
          Author
        </h3>
        <AuthorBox />
      </div>
    </div>
  )
}

export default DetailsSections

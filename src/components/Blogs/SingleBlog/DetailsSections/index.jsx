import { Divider } from '@mui/material'
import React from 'react'
import Intro from './Intro'
import Section2 from './Section2'
import Section3 from './Section3'
import Section4 from './Section4'

function DetailsSections() {
  return (
    <div className="flex flex-col gap-7 pe-[13%]">
      <p className="text-[#475467] text-[20px] font-[400]">
        Neural networks are a fascinating subset of artificial intelligence that
        mimic the way human brains operate. They consist of interconnected
        nodes, or neurons, that process data in layers.
      </p>
      <Divider sx={{ borderColor: '#EAECF0' }} />
      <Intro />
      <Section2 />
      <Section3 />
      <Section4 />
    </div>
  )
}

export default DetailsSections

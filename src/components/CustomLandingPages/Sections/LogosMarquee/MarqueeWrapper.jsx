import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import Marquee from 'react-fast-marquee'

function MarqueeWrapper({ children }) {
  return (
    <Marquee autoFill>
      <div>{children}</div>
    </Marquee>
  )
}

export default MarqueeWrapper

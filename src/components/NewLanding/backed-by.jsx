import React from 'react'

import Img from '../Product/Img'

import backedby1 from '../../../src/assets/hero/backed-by/1.png'
import backedby2 from '../../../src/assets/hero/backed-by/2.png'
import backedby3 from '../../../src/assets/hero/backed-by/3.png'

function BackedBy() {
  return (
    <div className="flex flex-col items-center gap-5 w-full overflow-hidden">
      <div className="text-3xl lg:text-4xl font-semibold text-center mb-10 font-primary mt-5 md:mt-10">
        Lyrise is backed by
      </div>
      <div className="flex gap-10 mx-10">
        <div className="h-auto w-1/3">
          <Img src={backedby1} className="" />
        </div>
        <div className="h-auto w-1/3">
          <Img src={backedby2} />
        </div>
        <div className="h-auto w-1/3">
          <Img src={backedby3} />
        </div>
      </div>
    </div>
  )
}

export default BackedBy

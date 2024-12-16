import React from 'react'

import Img from '../Product/Img'
import PageSection from '@components/NewLanding/section/PageSection'
import PageSectionTitle from '@components/NewLanding/section/PageSectionTitle'

import backedby1 from '../../../src/assets/hero/backed-by/1.png'
import backedby2 from '../../../src/assets/hero/backed-by/2.png'
import backedby3 from '../../../src/assets/hero/backed-by/3.png'

function BackedBy() {
  return (
    <PageSection className="flex flex-col items-center gap-5 w-full overflow-hidden">
      <PageSectionTitle title="Lyrise is Backed By" />
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
    </PageSection>
  )
}

export default BackedBy

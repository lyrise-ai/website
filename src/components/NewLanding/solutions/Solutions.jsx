import React from 'react'

import { solutions } from './solutions.config'
import Solution from './Solution'
import Img from '../../Product/Img'
import PageSection from '@components/NewLanding/section/PageSection'

import useCaseFinderImage from '../../../assets/solutions/ai-use-case-finder.png'
import gapAnalysisImage from '../../../assets/solutions/gap-analysis.png'
import jdGeneratorImage from '../../../assets/solutions/jd-genai.png'
import lyriseAiImage from '../../../assets/solutions/lyrise-ai.png'

const images = {
  'ai-use-case-finder': useCaseFinderImage,
  'gap-analysis': gapAnalysisImage,
  'jd-genai': jdGeneratorImage,
  'lyrise-ai': lyriseAiImage,
}

export default function Solutions() {
  return (
    <PageSection>
      <div className="text-3xl lg:text-4xl font-semibold text-center font-primary mt-20">
        Lyrise LLM Solutions
      </div>
      <div className="grid md:grid-cols-2 gap-5 md:gap-10 max-w-6xl mx-auto mt-16">
        {solutions.map((solution) => (
          <Solution key={solution.id} {...solution}>
            <Img src={images[solution.key]} className="w-full h-auto" />
          </Solution>
        ))}
      </div>
    </PageSection>
  )
}

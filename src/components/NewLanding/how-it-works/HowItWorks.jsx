import { useState } from 'react'
import StickyProgress from '../../StickyProgress/StickyProgress'
import PageSection from '@components/NewLanding/section/PageSection'
import PageSectionTitle from '@components/NewLanding/section/PageSectionTitle'
import HowItWorksElement from './HowItWorksElement'

import talentSuggetionsImage from '@assets/new-how/talent-suggetions.png'
import bookWithTalentsImage from '@assets/new-how/book-with-talents.png'
import engineerCardImage from '@assets/new-how/engineer-card.png'

export const robHowItWorksConfig = [
  {
    id: 0,
    title: '1. Find your vetted AI talent with AI in seconds',
    name: 'Find AI Talent',
    description:
      'Our team will listen to all of your requirements and find the talent that is your perfect fit.',
    icon: 'IconPath',
    image: talentSuggetionsImage,
    imageClassName: 'absolute -bottom-3 -right-10 left-5',
    getStartedUrl: '/',
  },
  {
    id: 1,
    title: '2. Book interviews with selected talents',
    name: 'Interview AI Talent',
    description:
      'With a wide-yet-niche pool with over 1200+ talents, we will get you a hand-picked shortlist of AI & software engineers superstars for your review that have the exact skill set that you are looking for.',
    icon: 'IconPath',
    image: bookWithTalentsImage,
    imageClassName: 'absolute -bottom-3 right-0',
    getStartedUrl: '/',
  },
  {
    id: 2,
    title: '3. Hire your AI Talent!',
    name: 'Hire AI Talent!',
    description:
      'With a wide-yet-niche pool with over 1200+ talents, we will get you a hand-picked shortlist of AI & software engineers superstars for your review that have the exact skill set that you are looking for.',
    icon: 'IconPath',
    image: engineerCardImage,
    imageClassName:
      'absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 scale-125',
    getStartedUrl: '/',
  },
]

export default function HowItWorks({ config }) {
  // a ref for each section to know which one is in view
  const [elementInView, setElementInView] = useState(0)
  const checkpoints = config.map((item) => item.name || item.title)
  return (
    <PageSection className="relative mt-20">
      <PageSectionTitle title="Our Process" />
      <StickyProgress index={elementInView} checkpoints={checkpoints} />
      {config.map((item) => (
        <HowItWorksElement
          key={item.id}
          {...item}
          setElementInView={setElementInView}
          isReversed={item.id % 2 === 0}
        />
      ))}
    </PageSection>
  )
}

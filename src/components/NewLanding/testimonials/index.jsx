import React from 'react'
import PageSection from '@components/NewLanding/section/PageSection'
import PageSectionTitle from '@components/NewLanding/section/PageSectionTitle'
import Testimonials from './../../Product/Testimonials'

function LandingTestimonials() {
  return (
    <PageSection className="text-center w-full mt-32">
      <PageSectionTitle
        subtitle="Testimonials"
        title="What our clients say about us."
      />

      <div
        className="max-w-[1440px] w-[80vw] m-auto rounded-2xl overflow-hidden md:h-[60vh] flex flex-col items-center"
        style={{
          boxShadow: '0px 8.99711px 17.99422px 0px rgba(0, 34, 158, 0.15)',
        }}
      >
        <Testimonials />
      </div>
    </PageSection>
  )
}

export default LandingTestimonials

import React from 'react'
import Testimonials from './../../Product/Testimonials'

function LandingTestimonials() {
  return (
    <div className="text-center w-full mt-32">
      <h3 className="text-neutral-500 font-secondary mb-3">Testimonials</h3>
      <h1 className="text-3xl lg:text-4xl max-w-[500px] m-auto font-medium mb-20 font-primary max-sm:max-w-[90%]">
        What our clients say about us.
      </h1>

      <div
        className="max-w-[1440px] w-[80vw] m-auto rounded-2xl overflow-hidden md:h-[60vh] flex flex-col items-center"
        style={{
          boxShadow: '0px 8.99711px 17.99422px 0px rgba(0, 34, 158, 0.15)',
        }}
      >
        <Testimonials />
      </div>
    </div>
  )
}

export default LandingTestimonials

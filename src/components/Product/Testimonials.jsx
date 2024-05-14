import React from 'react'

import ahmedImage from '../../assets/product/testimonials/ahmedsheikha/image.png'
import ahmedLogo from '../../assets/product/testimonials/ahmedsheikha/mobilelogo.png'
import ahmedDeskLogo from '../../assets/product/testimonials/ahmedsheikha/desktoplogo.png'
import robertLogo from '../../assets/product/testimonials/robertpratt/logo.png'
import robertImage from '../../assets/product/testimonials/robertpratt/image.png'
import ibrahimLogo from '../../assets/product/testimonials/ahmedibrahim/logomobile.png'
import ibrahimDeskLogo from '../../assets/product/testimonials/ahmedibrahim/logodesktop.png'
import ibrahimImage from '../../assets/product/testimonials/ahmedibrahim/image.png'
import LyCarousel from './LyCarousel'
import Img from './Img'

const testimonials = [
  // {
  //   id: 1,
  //   name: 'Ahmed Sheikha',
  //   title: 'Chief Business Officer',
  //   image: ahmedImage,
  //   mobileLogo: ahmedLogo,
  //   DesktopLogo: ahmedDeskLogo,
  //   quote: `"lyrise helped us focus on what really matters. lyrise made the hiring
  //   process painless, supported us with technical advice, and saved us
  //   over 50% in terms of cost and time."`,
  // },
  {
    id: 2,
    name: 'Robert Pratt',
    title: 'Head of Data Science',
    image: robertImage,
    mobileLogo: robertLogo,
    DesktopLogo: robertLogo,
    quote: `"Scale, Speed & Owning Problems are three reasons why I would
    wholeheartedly recommend Lyrise."`,
  },
  {
    id: 3,
    name: 'Ahmed Ibrahim',
    title: 'Founder & CEO',
    image: ibrahimImage,
    mobileLogo: ibrahimLogo,
    DesktopLogo: ibrahimDeskLogo,
    quote: `“LyRise team have been absolutely incredible and have scaled with our
    needs very well, making adjustments along the way to ensure their solution matched our requirements perfectly. ”`,
  },
]

export default function Testimonials() {
  return (
    <LyCarousel>
      {testimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="w-full h-full flex flex-col gap-8 md:grid grid-cols-4 p-2 pb-10 md:p-20 max-w-[90%] m-auto relative"
        >
          <Img
            src={testimonial.DesktopLogo}
            className="hidden md:block absolute right-[10%] lg:right-[7%] bottom-1/4"
          />
          <div className="col-span-1 h-full w-full relative flex justify-center items-center">
            <Img src={testimonial.image} className="object-contain" />
          </div>
          <Img src={testimonial.mobileLogo} className="md:hidden w-[40%]" />
          <div className="col-span-3 h-full flex flex-col gap-5 justify-center text-left">
            <h2 className="text-2xl md:text-3xl font-primary-500 text-gray-500 md:text-black">
              {testimonial.quote}
            </h2>
            <div>
              <h4 className="text-xl font-secondary font-bold">
                - {testimonial.name}
              </h4>
              <h4 className="font-secondary text-gray-500">
                {testimonial.title}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </LyCarousel>
  )
}

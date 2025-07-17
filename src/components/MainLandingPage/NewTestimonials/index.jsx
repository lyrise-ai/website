import React from 'react'
import melissaImage from '../../../assets/rebranding/testimonials/melissaImage.png'
import ranjanImage from '../../../assets/rebranding/testimonials/ranjanImage.png'
import quantraxImage from '../../../assets/rebranding/testimonials/quantrax.svg'
import silverBulletImage from '../../../assets/rebranding/testimonials/silverBullet.svg'
import techstarsImage from '../../../assets/rebranding/testimonials/techstars.svg'
import robertImage from '../../../assets/product/testimonials/robertpratt/image.png'
import Image from 'next/image'

const content = {
  title: 'What people say',
  subtitle: '',

  cards: [
    {
      index: 0,
      name: 'Robert Pratt',
      jobTitle: 'Head of Data Science',
      whatSaid:
        'Scale, Speed & Owning Problems are three reasons why I would wholeheartedly recommend LyRise.',

      icon: silverBulletImage,
      image: robertImage,
    },
    {
      index: 1,
      name: 'Melissa Pegus',
      jobTitle: 'Managing Director',
      whatSaid:
        'LyRise’s innovative approach to talent acquisition and management has the capacity to fundamentally transform the way companies are built.',

      icon: techstarsImage,
      image: melissaImage,
    },
    {
      index: 2,
      name: 'Ranjan Dharmaraja',
      jobTitle: 'Founder & CEO',
      whatSaid:
        'LyRise helped Quantrax build strong AI models fast, enabling success in a tough industry. Highly recommended.',

      icon: quantraxImage,
      image: ranjanImage,
    },
  ],
}

function NewTestimonials() {
  const { title, cards } = content
  return (
    <section>
      <div className="w-full flex flex-col gap-12 text-white py-10 mb-12 px-0">
        {/* Header Section */}
        <div className="flex flex-col gap-3 xl:mx-[11vw] px-5 xl:px-0">
          <div className="flex flex-col gap-1">
            {/* title */}
            <h3 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[30px] lg:text-[40px] lg:w-[30vw]">
              {title}
            </h3>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 w-full xl:px-[11vw] px-5">
          {cards.map((card) => (
            <div
              key={card.index}
              className="bg-[#DCDCDC] hover:bg-[#C0C0C0] transition-all duration-300 rounded-[20px] p-8 shadow-lg flex flex-col justify-between h-full gap-4 cursor-pointer"
            >
              <div className="flex gap-3 items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-[#2C2C2C] font-outfit font-[600] text-[20px] leading-[120%]">
                    {card.name}
                  </h4>
                  <p className="text-[#2C2C2C] font-outfit font-[400] text-[16px] opacity-80 leading-[120%]">
                    {card.jobTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <p className="text-[#2C2C2C] font-outfit font-[400] text-[16px] leading-[120%]">
                  {card.whatSaid}
                </p>
              </div>

              {/* Company Logo */}
              <div className="flex justify-start">
                <div
                  className={`h-12 flex items-center ${
                    card.index === 1 ? 'relative right-4' : ''
                  }`}
                >
                  <Image
                    src={card.icon}
                    alt="Company logo"
                    className="h-full object-contain "
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default NewTestimonials

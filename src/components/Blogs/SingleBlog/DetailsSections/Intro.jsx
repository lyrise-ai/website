import React from 'react'
import StaticImage from '../../../../assets/staticImages/introImage.png'
import Image from 'next/image'
import LinkIcon from '../../../../assets/icons/linkIcon'

function Intro() {
  return (
    <section id="intro" className="w-full flex flex-col gap-1 sm:gap-0">
      <h2 className="text-[#101828] text-[25px] md:text-[30px] font-semibold">
        Introduction
      </h2>

      <p className="text-[#475467] text-[16px] md:text-[18px] font-[400] ">
        At the core of artificial intelligence, neural networks play a crucial
        role in enabling machines to learn and adapt. These networks consist of
        layers of nodes that process information, allowing them to identify
        complex patterns and make predictions. From healthcare diagnostics to
        financial forecasting, the versatility of neural networks is astounding.
        As we continue to refine these technologies, the future holds immense
        potential for advancements that could enhance our understanding of data
        and improve decision-making processes.
      </p>

      <div className="flex flex-col gap-4 mt-10">
        <div className="w-full h-full flex justify-start">
          <Image src={StaticImage} alt="introImage" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <LinkIcon />
          <p className="text-[#475467] text-[13px] sm:text-[14px] font-[400] leading-5">
            Image courtesy of Vlada Karpovich via{' '}
            <span className="underline">Pexels</span>
          </p>
        </div>
      </div>

      <p className="text-[#475467] text-[16px] md:text-[18px] font-[400]  mt-10">
        Neural networks are a key technology driving the AI revolution. They
        operate by mimicking the way neurons in the human brain communicate,
        allowing machines to learn from experience. This learning process
        involves adjusting the connections between neurons based on the data
        they process. As a result, neural networks can tackle a wide range of
        challenges, from translating languages to detecting fraud. The ongoing
        research in this field promises to unlock even more capabilities, making
        neural networks an exciting area to watch.
      </p>

      <div className="flex flex-col gap-5 mt-10 sm:border-l-[2px] border-[#7F56D9]  sm:pl-[22px]">
        <blockquote className="text-[#101828] text-[20px] md:text-[24px] font-[500] leading-9 italic text-center sm:text-left">
          “In a world older and more complete than ours they move finished and
          complete, gifted with extensions of the senses we have lost or never
          attained, living by voices we shall never hear.”
        </blockquote>
        <cite className="text-[#475467] text-[14px] md:text-[16px] font-[400] not-italic">
          — Olivia Rhye, Product Designer
        </cite>
      </div>

      <p className="text-[#475467] text-[16px] md:text-[18px] font-[400]  mt-10">
        Neural networks are a key technology driving the AI revolution. They
        operate by mimicking the way neurons in the human brain communicate,
        allowing machines to learn from experience. This learning process
        involves adjusting the connections between neurons based on the data
        they process. As a result, neural networks can tackle a wide range of
        challenges, from translating languages to detecting fraud. The ongoing
        research in this field promises to unlock even more capabilities, making
        neural networks an exciting area to watch.
      </p>
    </section>
  )
}

export default Intro

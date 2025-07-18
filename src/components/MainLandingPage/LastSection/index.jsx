import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import LyriseLogo from '../../../assets/rebranding/lyriselogo.png'
import { WaitlistModal } from '../OurGuarantee/WaitlistModal'

function LastSection() {
  return (
    <div className={`${styles.bg} `}>
      <div className="flex justify-center items-center h-full md:flex-row flex-col md:py-10">
        <div>
          <Image src={LyriseLogo} alt="Lyrise Logo" className="md:mx-[10vw]" />
        </div>
        <div className="flex flex-col gap-3 justify-center items-center md:items-start ">
          <div className="flex flex-col gap-3 md:mr-[10vw] mx-[10vw] md:mx-0">
            <h3 className="text-[28px] font-[500] text-white mb-2 font-outfit leading-[120%] md:w-[30vw] w-full ">
              The journey to transforming your business starts with a
              conversation.
            </h3>
            <p className="md:w-[30vw] w-full text-center md:text-left text-[18px] font-[400] text-white mb-2 font-outfit leading-[120%]">
              Let’s map your process, show you the opportunities for
              improvement, and demonstrate how we can help you achieve 3x
              profits. No pressure, no commitment—just results.
            </p>
          </div>
          <WaitlistModal>
            <div className="cursor-pointer hover:bg-gray-200 transition-all duration-300 w-fit mt-[5vh] mb-10 md:mb-0 bg-white text-black rounded-full px-8 py-3 text-[16px] font-semibold">
              Book Your Consultation
            </div>
          </WaitlistModal>
        </div>
      </div>
    </div>
  )
}

export default LastSection

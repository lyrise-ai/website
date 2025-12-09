import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import LyriseLogo from '../../../assets/rebranding/lyriselogo.png'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { WaitlistModal } from '../OurGuarantee/WaitlistModal'

function LastSection() {
  return (
    <div className={`${styles.bg} `}>
      <div className="flex justify-center items-center h-full md:flex-row flex-col md:py-10">
        <div className="flex flex-col items-center md:mx-[10vw] md:mb-0 mb-[10vh]">
          <Image src={LyriseLogo} alt="Lyrise Logo" width={300} height={100} />
          <div className="flex gap-6 justify-center">
            <a
              href="https://www.facebook.com/LYRISEAI"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook page"
            >
              <FaFacebook className="text-white text-3xl hover:text-gray-300 transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/lyriseai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram page"
            >
              <FaInstagram className="text-white text-3xl hover:text-gray-300 transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/company/lyriseai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our LinkedIn page"
            >
              <FaLinkedin className="text-white text-3xl hover:text-gray-300 transition-colors" />
            </a>{' '}
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-between h-full items-center md:items-start">
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

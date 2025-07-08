import React from 'react'
import styles from './styles.module.css'
import Image from 'next/image'
import LyriseLogo from '../../../assets/rebranding/lyriselogo.png'

function LastSection() {
  return (
    <div className={styles.bg}>
      <div className="flex justify-center items-center h-full">
        <div>
          <Image src={LyriseLogo} alt="Lyrise Logo" className="mx-[10vw]" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 mr-[10vw]">
            <h3 className="text-[24px] font-[400] text-white mb-2 font-outfit leading-[120%] w-[30vw]">
              The journey to transforming your business starts with a
              conversation.
            </h3>
            <p className="w-[30vw] text-[16px] font-[400] text-white mb-2 font-outfit leading-[120%]">
              Let’s map your process, show you the opportunities for
              improvement, and demonstrate how we can help you achieve 3x
              profits. No pressure, no commitment—just results.
            </p>
          </div>
          <a
            href="https://calendly.com/elena-lyrise/30min"
            target={'_blank'}
            rel="noopener noreferrer"
            className="w-fit mt-[5vh] bg-white text-black rounded-full px-8 py-3 text-[16px] font-semibold"
          >
            Book Your Free Consultation
          </a>
        </div>
      </div>
    </div>
  )
}

export default LastSection

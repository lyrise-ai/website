import Image from 'next/legacy/image'
import WhiteLyRiseLogo from '../../assets/rebranding/logo_black.svg'

import styles from './footer.module.css'
import FooterColumn from './FooterColumn'
import {
  footerLinksOne,
  footerLinksThree,
  footerLinksTwo,
  headingEnum,
} from '../../components/Layout/Footer/FooterData'

const MobileFooter = () => {
  return (
    <footer className="p-5 py-8">
      <div
        className={`custom-container flex flex-col h-full justify-between gap-4 p-[20px_26px] 
 rounded-[4px] ${styles.mainFooter}`}
      >
        {/* logo */}
        <div className="flex flex-col justify-between">
          <div>
            <Image
              src={WhiteLyRiseLogo}
              width={105}
              height={37}
              alt="LyRise Logo"
            />
          </div>
        </div>
        {/* 4 columns */}
        <div className="flex flex-col justify-between gap-2">
          <div className="flex justify-between">
            {/* first column */}
            <FooterColumn
              heading={headingEnum.EMPLOYERS}
              links={footerLinksOne}
            />
            {/* 2nd column */}
            <FooterColumn
              heading={headingEnum.TALENTS}
              links={footerLinksTwo}
            />
          </div>
          <div className="flex justify-between">
            {/* 3rd column - Form */}
            <FooterColumn
              heading={headingEnum.COMPANY}
              links={footerLinksThree}
            />
          </div>
        </div>
        {/* button */}
        <div className={styles.bookMeetingCard}>
          <div className="text-[18px] md:text-[24px] font-semibold leading-[24px] text-white">
            Book an AI Consultation Now!
          </div>

          <div className="w-full">
            <a
              href="https://calendly.com/elena-lyrise/30min"
              target={'_blank'}
              rel="noopener noreferrer"
            >
              <button className={styles.bookMeetingBtn} type="button">
                Book a Meeting
              </button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default MobileFooter

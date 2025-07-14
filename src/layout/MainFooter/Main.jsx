import WhiteLyRiseLogo from '../../assets/rebranding/logo_black.svg'
import styles from './footer.module.css'
import {
  footerLinksOne,
  footerLinksThree,
  footerLinksTwo,
  headingEnum,
} from '../../components/Layout/Footer/FooterData'
import Image from 'next/legacy/image'
import FooterColumn from './FooterColumn'

const Main = () => {
  return (
    <footer className="p-[60px_10%]">
      <div
        className={`h-full flex justify-between gap-4 p-[40px_36px]
 rounded-[4px]  ${styles.mainFooter}`}
      >
        {/* 4th column - Form */}
        <div className="grid grid-cols-[1fr_0.6fr] gap-[60px]">
          {/* <div className="rounded-lg bg-white shadow-[0px_6px_12px_0px_#00229E1C] flex flex-col gap-4 p-6 justify-center"> */}

          {/* logo */}
          <div className="flex justify-center w-full">
            <Image
              src={WhiteLyRiseLogo}
              width={105}
              height={37}
              alt="LyRise Logo"
            />
          </div>
          <div className={styles.bookMeetingCard}>
            <div className="text-[18px] md:text-[24px]  font-semibold leading-[24px] text-white">
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
      </div>
    </footer>
  )
}

export default Main

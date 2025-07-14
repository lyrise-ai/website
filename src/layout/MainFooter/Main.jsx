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
      <div className={`${styles.mainFooter} rounded-[4px] p-[40px_36px]`}>
        {/* Horizontal layout with logo and booking card on opposite sides */}
        <div className="flex flex-col md:flex-row items-center justify-around gap-[60px] w-full">
          {/* Logo section - Left side */}
          <div className="flex justify-center items-center">
            <Image
              src={WhiteLyRiseLogo}
              width={250}
              height={80}
              alt="LyRise Logo"
            />
          </div>

          {/* Booking card section - Right side */}
          <div className={`${styles.bookMeetingCard} max-w-[400px]`}>
            <div className="text-[18px] md:text-[24px] font-semibold leading-[24px] text-white text-center">
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

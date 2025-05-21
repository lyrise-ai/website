import Marquee from 'react-fast-marquee'
import Image from 'next/legacy/image'

import IBMLogo from '../../../assets/rebranding/ibm.svg'
import TechStartsLogo from '../../../assets/rebranding/jp-morgan.svg'
import GoogleStartupsLogo from '../../../assets/rebranding/google-startups.svg'

const logoNumbers = 8

function LogoSection() {
  return (
    <div className="mt-[-150px] lg:mt-[-50px]">
      <h1 className=" text-center text-[36px] leading-[100%] font-bold text-new-black font-outfit">
        Associated with
      </h1>
      <div className="flex justify-center items-center flex-wrap  gap-[8vw]">
        <Image src={TechStartsLogo} alt="TechStars" width={150} height={150} />
        <Image src={IBMLogo} alt="IBM" width={150} height={150} />
        <Image
          src={GoogleStartupsLogo}
          alt="Google For Startups"
          width={150}
          height={50}
        />
      </div>
    </div>
  )
}

export default LogoSection

function MarqueeWrapper({ children }) {
  return (
    <Marquee autoFill>
      <div>{children}</div>
    </Marquee>
  )
}

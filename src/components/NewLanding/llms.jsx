import lyriseAI from '../../assets/llms/lyrise-ai.png'
import lyriseGPT from '../../assets/llms/lyrise-gpt.png'
import WhiteRightArrow from '../../assets/WhiteRightArrow.svg'
import Img from '../Product/Img'
import PageSection from '@components/NewLanding/section/PageSection'

// import microsoftLogo from '../../../assets/hero/microsoft.png'

function LLMs() {
  return (
    <PageSection className="flex flex-col items-center gap-5 w-full overflow-hidden mb-14">
      {/* <div className="text-3xl lg:text-4xl font-semibold text-center mb-10 font-primary">
        Lyrise LLM Solutions
      </div> */}
      {/* <div className="md:grid grid-cols-2 gap-5 md:gap-8 w-full max-w-[1200px]"> */}
      {/* <Solution
          title="LyRiseGPT"
          imgSrc={lyriseGPT}
          subtitle="Figure out how A.I. fits in your business"
          description="Let LyRiseGPT, your AI business advisor, help you identify the ideal AI applications for your industry and calculate their potential R.O.I."
          link="/"
          phase="Beta"
        /> */}
      <Solution
        title="LyRiseAI"
        imgSrc={lyriseAI}
        subtitle="Find the A.I. talents you need."
        description="LyRise AI connects you with top AI talent to bring your AI use cases to life. Skip the recruitment hassle and focus on building your AI future."
        link="/lyriseAI-beta"
        phase="Beta"
      />
      {/* </div> */}
    </PageSection>
  )
}

export default LLMs

function Solution({ title, imgSrc, subtitle, description, link, phase }) {
  return (
    // <>
    // <div className="md:hidden col-span-1 h-auto p-5 bg-white rounded-lg flex flex-col items-center justify-between max-sm:mx-5 max-sm:mb-5">
    //   <h2 className="text-4xl font-semibold text-center my-4 flex justify-center">
    //     {title}
    //     <sup className="text-xs rounded-lg bg-cyan-100 text-cyan-600 px-1 py-0.5 ml-2 font-normal h-fit">
    //       {phase}
    //     </sup>
    //   </h2>
    //   <Img src={imgSrc} alt={title} />
    //   <div className="bg-[#F7F9FF] rounded-lg p-4 self-end">
    //     <h3 className="w-full font-semibold font-secondary text-xl">
    //       {subtitle}
    //     </h3>
    //     <p className="w-full text-lg font-secondary">{description}</p>
    //     <a
    //       href={link}
    //       className="self-start flex gap-1 rounded-lg bg-primary px-2 py-1 text-white w-fit text-base mt-2 font-secondary items-center"
    //     >
    //       Try It Now!{' '}
    //       <Img
    //         src={WhiteRightArrow}
    //         alt="arrow"
    //         width={14}
    //         className={'mt-1'}
    //       />
    //     </a>
    //   </div>
    // </div>

    <div className="col-span-1 h-auto p-5 bg-white rounded-2xl flex flex-col-reverse items-center justify-between md:grid grid-cols-2 max-sm:mx-5 max-sm:mb-5 max-w-6xl gap-4">
      <div>
        <h2 className="md:flex hidden text-3xl lg:text-5xl font-semibold my-4">
          {title}
          <sup className="text-xs rounded-lg bg-cyan-100 text-cyan-600 px-1 py-0.5 ml-2 font-normal h-fit">
            {phase}
          </sup>
        </h2>
        <div className="bg-[#F7F9FF] rounded-lg p-4 self-end">
          <h3 className="w-full font-medium font-secondary text-[1.35rem]">
            {subtitle}
          </h3>
          <p className="w-full text-lg font-secondary leading-5 text-neutral-900">
            {description}
          </p>
          <a
            href={link}
            className="self-start flex gap-2 rounded-lg bg-primary px-4 py-1 text-white w-fit text-base mt-2 font-secondary items-center"
          >
            Join Our Beta!{' '}
            <Img
              src={WhiteRightArrow}
              alt="arrow"
              width={14}
              className={'mt-1'}
            />
          </a>
        </div>
      </div>
      <div className="col-span-1 h-full flex items-center justify-center">
        <Img src={imgSrc} alt={title} className={''} />
      </div>
      <h2 className="flex md:hidden text-3xl lg:text-5xl font-semibold my-4">
        {title}
        <sup className="text-xs rounded-lg bg-cyan-100 text-cyan-600 px-1 py-0.5 ml-2 font-normal h-fit">
          {phase}
        </sup>
      </h2>
    </div>
  )
}

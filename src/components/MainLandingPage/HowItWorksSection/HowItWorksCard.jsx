import styles from './styles.module.css'

function HowItWorksCard({ step }) {
  return (
    <div className={styles.stepCard}>
      <div className="flex flex-col gap-4 ">
        <h3 className="text-[#ffffff] font-[600] text-[15px] font-outfit leading-[100%]">
          {step.title}
        </h3>
        <div className="flex flex-col gap-2">
          <h4 className="text-[#ffffff] font-[600] text-[20px] lg:text-[22.84px] font-outfit leading-[100%]">
            {step.subtitle}
          </h4>
          <p className="text-[#ffffff] font-[400] text-[16px] lg:text-[18px] font-outfit leading-[120%]">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksCard

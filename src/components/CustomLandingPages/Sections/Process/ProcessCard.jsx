import styles from '../styles.module.css'

function ProcessCard({ step }) {
  return (
    <div className={styles.stepCard}>
      <div className="flex flex-col gap-4 ">
        <h3 className="text-[#ffffff] font-[600] text-[17px] font-space-grotesk leading-[100%]">
          {step.title}
        </h3>
        <div className="flex flex-col gap-2">
          <h4 className="text-[#ffffff] font-[600] text-[20px] lg:text-[27.24px] font-space-grotesk leading-[100%]">
            {step.subtitle}
          </h4>
          <p className="text-[#ffffff] font-[400] text-[16px] lg:text-[18px] font-poppins">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProcessCard

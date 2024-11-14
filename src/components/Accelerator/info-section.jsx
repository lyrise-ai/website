import Image from 'next/image'

import SectionWrapper from './section-wrapper'

export default function InfoSection({
  title,
  iconSrc,
  children,
  color = 'rose',
}) {
  const getTitleWithIcon = () => {
    return (
      <div className="flex items-center gap-2 w-full">
        {iconSrc && <Image src={iconSrc} alt="icon" className="w-6 h-6" />}
        <h2 className={`text-xl font-secondary font-bold text-${color}-600`}>
          {title}
        </h2>
      </div>
    )
  }

  return (
    <SectionWrapper
      title={getTitleWithIcon()}
      className={`border border-${color}-300 !text-${color}-800 !bg-${color}-100 gap-0`}
    >
      {children}
    </SectionWrapper>
  )
}

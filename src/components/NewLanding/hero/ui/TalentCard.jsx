import { useMediaQuery } from '@mui/material'

import SeniorityIcon from '../../../../assets/icons/seniorityIcon'
import ArrowButton from '../../../Buttons/ArrowButton'
import { getSeniorityFromYears } from '../../../../utilities/helpers'
import { useCallback, useMemo } from 'react'
import { LYRISEAI_PRODUCT_URL } from '../../../../constants/main'

export default function TalentCard({
  index,
  job_title,
  reasoning,
  relevant_use_cases,
  years_of_experience,
  sessionId,
}) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const alphabet = useMemo(() => 'abcdefghijklmnopqrstuvwxyz', [])
  const candidateLetter = alphabet[index % 26]

  const seniority = getSeniorityFromYears(years_of_experience)

  const handleBookMeeting = useCallback(() => {
    window.open(LYRISEAI_PRODUCT_URL + 'signup?session=' + sessionId, '_blank')
  }, [])

  const handleCardClick = handleBookMeeting

  const handleViewTalentProfile = (e) => {
    e.stopPropagation()
    handleBookMeeting()
  }

  return (
    <button
      className="relative border bg-white p-3 md:p-5 rounded-2xl border-solid border-zinc-300 max-md:max-w-full hover:shadow-md transition-all duration-200 text-left"
      onClick={handleCardClick}
      type="button"
    >
      <div className="flex grow flex-col items-stretch justify-center">
        <div className="items-center flex gap-2">
          <div className="text-black text-lg font-medium leading-5 max-md:text-base font-primary">
            Candidate {candidateLetter.toUpperCase()}
            <span
              className={
                'px-2 py-1 rounded-md text-xs ml-3 gap-1 items-center inline-flex text-primary ' +
                (seniority === 'Senior'
                  ? 'bg-emerald-500 text-white'
                  : seniority === 'Mid-Senior'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-sky-500 text-white')
              }
            >
              <span className="inline-block">
                <SeniorityIcon />
              </span>
              <span className="inline-block">{seniority}</span>
            </span>
          </div>
        </div>
        <div className="text-slate-700 text-sm leading-5 mt-2 max-md:text-xs font-semibold">
          {job_title}
        </div>
        <div className="text-slate-700 text-sm leading-5 mt-2 max-md:text-xs">
          {reasoning.length > 100 && isMobile
            ? reasoning.substring(0, 150) + '...'
            : reasoning}
        </div>
      </div>

      <div className="md:absolute right-0 top-0 mt-3 md:mt-5 md:mr-5 max-md:w-full flex md:gap-2 justify-between">
        <ArrowButton
          variant="link"
          className="!text-sm max-md:!text-xs max-md:px-3"
          onClick={handleViewTalentProfile}
        >
          View Talent Profile
        </ArrowButton>
        <ArrowButton
          showArrow
          className="!text-sm max-md:!text-xs max-md:px-3"
          onClick={handleBookMeeting}
        >
          Book Meeting
        </ArrowButton>
      </div>
    </button>
  )
}

import { useEffect, useState } from 'react'

import SectionWrapper from './section-wrapper'
import {
  downvoteCompany,
  getLeaderboard,
  voteForCompany,
} from '../../services/accelerator.services'
import useWeakAuth from '@hooks/useWeakAuth'

export default function Leaderboard({ openVoteRegisterDialog }) {
  const [companies, setCompanies] = useState([])
  const { email } = useWeakAuth()

  const updateLeaderboard = (newData) => {
    setCompanies((prevCompanies) => {
      return prevCompanies.map((company) => {
        const updatedCompany = newData.find((c) => c.id === company.id)
        return updatedCompany ? { ...company, ...updatedCompany } : company
      })
    })
  }

  useEffect(() => {
    fetchCompanies()
    // Real-time illusion
    const intervalId = setInterval(fetchCompanies, 30000) // Fetch companies every 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  const fetchCompanies = () => {
    getLeaderboard().then(updateCompanies)
  }

  const updateCompanies = (newCompanies) => {
    const mappedCompanies = newCompanies.map((company) => ({
      id: company.id,
      name: company.name,
      useCase: company.ai_project_title,
      score: company.votes,
      voters: company.voters,
      ...company,
    }))
    setCompanies(mappedCompanies)
  }

  const sortedCompanies = [...companies].sort((a, b) => b.score - a.score)

  return (
    <>
      {email && (
        <SectionWrapper className="border-1 border-neutral-200">
          <h1 className="text-sm font-medium font-primary text-green-600">
            Welcome, {email}
          </h1>
        </SectionWrapper>
      )}
      <SectionWrapper
        title="Leaderboard"
        className="[&>*:nth-child(2)]:border-2 [&>*:nth-child(2)]:border-rose-600 min-h-[60vh]"
      >
        {sortedCompanies.map((company, index) => (
          <CompanyComponent
            company={company}
            key={company.id}
            index={index}
            openVoteRegisterDialog={openVoteRegisterDialog}
            fetchCompanies={fetchCompanies}
          />
        ))}
      </SectionWrapper>
    </>
  )
}

const CompanyComponent = ({
  company,
  index,
  openVoteRegisterDialog,
  fetchCompanies,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { email: userEmail } = useWeakAuth()
  const isUpvoted = company?.voters?.includes(userEmail)

  const toggleUpvote = (companyId) => {
    if (!userEmail) {
      openVoteRegisterDialog()
    } else {
      setIsLoading(true)
      if (isUpvoted) {
        downvoteCompany(companyId).then(() => {
          fetchCompanies()
          setIsLoading(false)
        })
      } else {
        voteForCompany(companyId).then(() => {
          fetchCompanies()
          setIsLoading(false)
        })
      }
    }
  }
  return (
    <div
      key={company.id}
      className="flex items-center justify-start p-2 rounded-xl bg-card hover:bg-accent/50 transition-colors w-full border border-rose-300 bg-primary-25 font-secondary"
    >
      <div className="font-semibold self-start mr-1 text-rose-600">
        <span className="text-[75%]">#</span>
        {index + 1}
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">{company.name}</h3>
        </div>
        <p className="text-neutral-500 text-xs">
          {company.useCase.length > 40
            ? company.useCase.slice(0, 40) + '...'
            : company.useCase}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center ml-auto">
        <button
          type="button"
          disabled={isLoading}
          className={`space-x-1 disabled:opacity-50`}
          onClick={() => toggleUpvote(company.id)}
        >
          <UpvoteIcon className="w-8 h-8" upvoted={isUpvoted} />
          <span className="sr-only">Upvote</span>
        </button>
        <span className="font-bold text-sm">{company.score}</span>
      </div>
    </div>
  )
}

const UpvoteIcon = ({ upvoted, className }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="0.5"
        y="1"
        width="23"
        height="23"
        rx="3.5"
        stroke={upvoted ? '#fda4af' : '#98A2B3'}
      />
      <path
        d="M7 10.9444L12 5.5M12 5.5L17 10.9444M12 5.5V19.5"
        stroke={upvoted ? '#e11d48' : '#111827'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

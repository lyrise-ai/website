import { useEffect, useState } from 'react'

import SectionWrapper from './section-wrapper'
import {
  downvoteCompany,
  getLeaderboard,
  voteForCompany,
} from '../../services/accelerator.services'
import useWeakAuth from '@hooks/useWeakAuth'
import Link from 'next/link'

export default function Leaderboard({ openVoteRegisterDialog }) {
  const [companies, setCompanies] = useState([])
  const [expandedCompany, setExpandedCompany] = useState(null)
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
    const mappedCompanies = newCompanies?.map((company) => ({
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
        className="[&>*:nth-child(2)]:border-2 [&>*:nth-child(2)]:border-rose-600 min-h-[60vh] !justify-start"
      >
        {sortedCompanies?.map((company, index) => (
          <LeaderboardCompanyCard
            company={company}
            key={company.id}
            index={index}
            openVoteRegisterDialog={openVoteRegisterDialog}
            fetchCompanies={fetchCompanies}
            setExpandedCompany={setExpandedCompany}
          />
        ))}
        {sortedCompanies.length === 0 && (
          <div className="text-neutral-500 text-center font-secondary text-base border-none">
            No companies registered yet.
          </div>
        )}
      </SectionWrapper>
      <CompanyDetailsDialog
        company={expandedCompany}
        setCompany={setExpandedCompany}
        openVoteRegisterDialog={openVoteRegisterDialog}
        fetchCompanies={fetchCompanies}
        index={
          expandedCompany
            ? sortedCompanies.findIndex((c) => c.id === expandedCompany.id)
            : null
        }
      />
    </>
  )
}

const LeaderboardCompanyCard = ({
  company,
  index,
  openVoteRegisterDialog,
  fetchCompanies,
  setExpandedCompany,
  children,
  className,
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

  const handleUpvote = (e) => {
    e.stopPropagation()
    toggleUpvote(company.id)
  }

  const handleCardClick = () => {
    if (setExpandedCompany) {
      setExpandedCompany(company)
    }
  }

  return (
    <button
      type="button"
      key={company.id}
      onClick={handleCardClick}
      className={
        'p-2 rounded-xl bg-card hover:bg-accent/50 transition-colors w-full border border-rose-300 bg-primary-25 font-secondary ' +
        className
      }
    >
      <div className="flex items-center justify-start transition-colors w-full ">
        <div className="font-semibold self-start mr-1 text-rose-600">
          <span className="text-[75%]">#</span>
          {index + 1}
        </div>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-medium">{company.name}</h3>
          </div>
          <p className="text-neutral-500 text-xs text-left">
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
            onClick={handleUpvote}
          >
            <UpvoteIcon className="w-8 h-8" upvoted={isUpvoted} />
            <span className="sr-only">Upvote</span>
          </button>
          <span className="font-bold text-sm">{company.score}</span>
        </div>
      </div>
      {children ? <div className="mt-2">{children}</div> : null}
    </button>
  )
}

const CompanyDetailsDialog = ({
  company,
  setCompany,
  openVoteRegisterDialog,
  fetchCompanies,
  index,
}) => {
  const clearOpenCompany = () => {
    setCompany(null)
  }

  const patchedOpenVoteRegisterDialog = () => {
    clearOpenCompany()
    openVoteRegisterDialog()
  }

  if (company) {
    return (
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur flex items-center justify-center p-5"
        onClick={clearOpenCompany}
      >
        <LeaderboardCompanyCard
          company={company}
          index={index}
          openVoteRegisterDialog={patchedOpenVoteRegisterDialog}
          fetchCompanies={fetchCompanies}
          className="max-w-xl lg:scale-150"
        >
          <p className="text-neutral-500 bg-neutral-100 p-2 text-xs text-left font-secondary rounded-lg">
            {company.ai_project_details}
          </p>
          <div className="text-primary bg-neutral-100 p-2 underline text-xs !text-left font-secondary rounded-lg mt-2 flex gap-1 items-center">
            <URLIcon />
            <Link
              target="_blank"
              href={
                company.website.startsWith('http')
                  ? company.website
                  : `https://${company.website}`
              }
            >
              {company.website}
            </Link>
          </div>
        </LeaderboardCompanyCard>
      </div>
    )
  }
  return null
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

const URLIcon = ({ className }) => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7ZM5.34713 11.5078C5.2788 11.349 5.21585 11.1817 5.158 11.0081C4.98751 10.4966 4.85102 9.89942 4.75572 9.24428C4.10058 9.14898 3.50336 9.01249 2.99189 8.842C2.81835 8.78416 2.65102 8.7212 2.49217 8.65287C2.9768 9.9742 4.0258 11.0232 5.34713 11.5078ZM2.49217 5.34713C2.9768 4.0258 4.0258 2.9768 5.34713 2.49217C5.2788 2.65102 5.21585 2.81834 5.158 2.99189C4.98751 3.50336 4.85102 4.10058 4.75572 4.75572C4.10058 4.85102 3.50336 4.98751 2.99189 5.158C2.81834 5.21585 2.65102 5.2788 2.49217 5.34713ZM8.65287 2.49217C8.7212 2.65102 8.78416 2.81835 8.842 2.99189C9.01249 3.50336 9.14898 4.10058 9.24428 4.75572C9.89942 4.85102 10.4966 4.98751 11.0081 5.158C11.1817 5.21585 11.349 5.2788 11.5078 5.34713C11.0232 4.0258 9.9742 2.9768 8.65287 2.49217ZM11.5078 8.65287C11.349 8.7212 11.1817 8.78416 11.0081 8.842C10.4966 9.01249 9.89942 9.14898 9.24428 9.24428C9.14898 9.89942 9.01249 10.4966 8.842 11.0081C8.78416 11.1817 8.7212 11.349 8.65287 11.5078C9.9742 11.0232 11.0232 9.9742 11.5078 8.65287ZM6.99984 2.2C7.08485 2.19974 7.18581 2.34044 7.22939 2.39574C7.38552 2.59385 7.55236 2.9177 7.70358 3.37136C7.82444 3.73394 7.92842 4.15835 8.00952 4.63026C7.68084 4.61032 7.34343 4.6 7 4.6C6.65657 4.6 6.31916 4.61032 5.99048 4.63026C6.07159 4.15835 6.17556 3.73394 6.29642 3.37136C6.44764 2.9177 6.61448 2.59385 6.77061 2.39574C6.81449 2.34006 6.91455 2.20053 6.99984 2.2ZM2.39574 7.22939C2.59385 7.38552 2.9177 7.55236 3.37136 7.70358C3.73394 7.82444 4.15835 7.92842 4.63026 8.00952C4.61032 7.68084 4.6 7.34343 4.6 7C4.6 6.65657 4.61032 6.31916 4.63026 5.99048C4.15835 6.07159 3.73394 6.17556 3.37136 6.29642C2.9177 6.44764 2.59385 6.61448 2.39574 6.77061C2.28196 6.86028 2.19989 6.92994 2.2 7C2.20011 7.06944 2.2814 7.13928 2.39574 7.22939ZM5.8 7C5.8 7.39957 5.815 7.78677 5.84306 8.15694C6.21323 8.185 6.60043 8.2 7 8.2C7.39957 8.2 7.78677 8.185 8.15694 8.15694C8.185 7.78677 8.2 7.39957 8.2 7C8.2 6.60043 8.185 6.21323 8.15694 5.84306C7.78677 5.815 7.39957 5.8 7 5.8C6.60043 5.8 6.21323 5.815 5.84306 5.84306C5.815 6.21323 5.8 6.60043 5.8 7ZM6.29642 10.6286C6.17556 10.2661 6.07159 9.84165 5.99048 9.36974C6.31916 9.38968 6.65657 9.4 7 9.4C7.34343 9.4 7.68084 9.38968 8.00952 9.36974C7.92842 9.84165 7.82444 10.2661 7.70358 10.6286C7.55236 11.0823 7.38552 11.4062 7.22939 11.6043C7.1178 11.7459 7.04808 11.7965 7 11.7964C6.95274 11.7964 6.88245 11.7462 6.77061 11.6043C6.61448 11.4062 6.44764 11.0823 6.29642 10.6286ZM10.6286 7.70358C10.2661 7.82444 9.84165 7.92842 9.36974 8.00952C9.38968 7.68084 9.4 7.34343 9.4 7C9.4 6.65657 9.38968 6.31916 9.36974 5.99048C9.84165 6.07159 10.2661 6.17556 10.6286 6.29642C11.0823 6.44764 11.4062 6.61448 11.6043 6.77061C11.748 6.88386 11.8 6.925 11.8 7C11.8 7.075 11.6479 7.19499 11.6043 7.22939C11.4062 7.38552 11.0823 7.55236 10.6286 7.70358Z"
        fill="#344054"
        stroke="#F2F4F7"
        strokeWidth="0.3"
      />
    </svg>
  )
}

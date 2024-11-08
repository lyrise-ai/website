import { ThumbsUpDown, ThumbUp } from '@mui/icons-material'
import { useEffect, useState } from 'react'

import SectionWrapper from './section-wrapper'

export default function Leaderboard() {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'OpenAI',
      useCase: 'Natural Language Processing',
      score: 245,
    },
    { id: 2, name: 'DeepMind', useCase: 'Reinforcement Learning', score: 198 },
    { id: 3, name: 'Anthropic', useCase: 'AI Safety & Ethics', score: 167 },
    { id: 4, name: 'Stability AI', useCase: 'Image Generation', score: 134 },
    { id: 5, name: 'Cohere', useCase: 'Enterprise AI Solutions', score: 112 },
    { id: 6, name: 'Hugging Face', useCase: 'AI Model Hub & Tools', score: 89 },
  ])

  const [upvotedCompanies, setUpvotedCompanies] = useState(new Set())

  // TODO: should first register as a normal user to upvote
  // and he should be able to upvote only once (or as business will say)
  const handleUpvote = (companyId) => {
    setUpvotedCompanies((prev) => {
      const newUpvoted = new Set(prev)
      if (newUpvoted.has(companyId)) {
        newUpvoted.delete(companyId)
      } else {
        newUpvoted.add(companyId)
      }
      return newUpvoted
    })

    setCompanies((prevCompanies) =>
      prevCompanies.map((company) =>
        company.id === companyId
          ? { ...company, score: company.score + 1 }
          : company,
      ),
    )
  }

  // Function to update leaderboard with new data
  const updateLeaderboard = (newData) => {
    setCompanies((prevCompanies) => {
      return prevCompanies.map((company) => {
        const updatedCompany = newData.find((c) => c.id === company.id)
        return updatedCompany ? { ...company, ...updatedCompany } : company
      })
    })
  }

  // Simulating real-time updates (remove this in production)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const randomCompany = Math.floor(Math.random() * companies.length)
  //     const randomScore = Math.floor(Math.random() * 10)
  //     updateLeaderboard([{ id: randomCompany + 1, score: randomScore }])
  //   }, 5000)

  //   return () => clearInterval(interval)
  // }, [companies])

  // Sort companies by score
  const sortedCompanies = [...companies].sort((a, b) => b.score - a.score)

  return (
    <SectionWrapper
      title="Leaderboard"
      className="[&>*:nth-child(2)]:border-2 [&>*:nth-child(2)]:border-rose-600"
    >
      {sortedCompanies.map((company, index) => (
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
              className={`space-x-1 ${
                upvotedCompanies.has(company.id) ? 'text-primary' : ''
              }`}
              onClick={() => handleUpvote(company.id)}
            >
              <UpvoteIcon className="w-8 h-8" />
              <span className="sr-only">Upvote</span>
            </button>
            <span className="font-bold text-sm">{company.score}</span>
          </div>
        </div>
      ))}
    </SectionWrapper>
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
      <rect x="0.5" y="1" width="23" height="23" rx="3.5" stroke="#98A2B3" />
      <path
        d="M7 10.9444L12 5.5M12 5.5L17 10.9444M12 5.5V19.5"
        stroke="#111827"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

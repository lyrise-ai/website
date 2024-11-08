import { ThumbsUpDown, ThumbUp } from '@mui/icons-material'
import { useEffect, useState } from 'react'

import ArrowButton from '@components/Buttons/ArrowButton'
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
    <SectionWrapper title="Leaderboard">
      {sortedCompanies.map((company, index) => (
        <div
          key={company.id}
          className="flex items-center justify-between p-2 rounded-xl bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{index + 1}.</span>
              <h3 className="font-medium">{company.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{company.useCase}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">{company.score}</span>
            <ArrowButton
              variant="ghost"
              size="sm"
              className={`space-x-1 ${
                upvotedCompanies.has(company.id) ? 'text-primary' : ''
              }`}
              onClick={() => handleUpvote(company.id)}
            >
              <ThumbUp className="w-4 h-4" />
              <span className="sr-only">Upvote</span>
            </ArrowButton>
          </div>
        </div>
      ))}
    </SectionWrapper>
  )
}

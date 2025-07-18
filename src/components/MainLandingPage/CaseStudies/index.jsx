import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import XboxIconBlack from '../../../assets/rebranding/xbox-icon.svg'
import XboxIconWhite from '../../../assets/rebranding/xbox-white.svg'
import Image from 'next/image'
import { Modal, Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HdrStrongRoundedIcon from '@mui/icons-material/HdrStrongRounded'
import ShapeLineRoundedIcon from '@mui/icons-material/ShapeLineRounded'
import ScatterPlotRoundedIcon from '@mui/icons-material/ScatterPlotRounded'
import StairsRoundedIcon from '@mui/icons-material/StairsRounded'
import EscalatorRoundedIcon from '@mui/icons-material/EscalatorRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'

const content = {
  title: 'Case Studies',
  subtitle: '',

  cards: [
    {
      index: 0,
      title: 'Automating R&D tax credits',
      description: 'Unlocked AI features and accelerated development by 60%.',
      challenge:
        'Neo.Tax, automating R&D tax credits, needed specialized Natural Language Processing (NLP) expertise. Building this in-house was costly and challenging. They sought an agentic solution to enhance their core product.',
      solution:
        "LyRise provided a fractional team of NLP experts, integrating them into Neo.Tax's workflow. This offered dedicated expertise at a fraction of the cost of a single in-house specialist, saving over 60% on development expenses and significantly reducing time. LyRise experts also provided strategic guidance, acting as an extended agentic development arm.",
      impact:
        'The partnership delivered a critical module for accounting label classification with 93% higher accuracy, reducing overall product development time and costs by 50%. This showcased the power of an agentic approach to specialized AI challenges. Ahmad Ibrahim, Neo.Tax CEO, praised LyRise for scaling to their needs and matching requirements perfectly.',
      icon: HdrStrongRoundedIcon,
    },
    {
      index: 1,
      title: 'Legal Document Summarizer',
      description:
        'AI-powered legal assistant to 3x efficiency for document review and summarization.',
      challenge:
        'A legal firm needed to process thousands of documents daily, but manual review was time-consuming and error-prone. They required an AI solution to automate document analysis and summarization while maintaining legal accuracy.',
      solution:
        'LyRise deployed a team of AI specialists who developed a custom NLP model specifically trained on legal documents. The solution integrated seamlessly with their existing workflow, providing real-time document analysis and intelligent summarization.',
      impact:
        'The AI-powered legal assistant increased document review efficiency by 300%, reduced processing time from hours to minutes, and maintained 95% accuracy in legal document analysis. The firm saved over $200K annually in operational costs.',
      icon: ShapeLineRoundedIcon,
    },
    {
      index: 2,
      title: 'Debt Repayment Prediction',
      description:
        'AI model predicting repayments with 90% accuracy, driving 5.2x ROI.',
      challenge:
        'A financial services company struggled with loan default prediction, leading to significant losses. They needed an accurate AI model to assess borrower risk and optimize lending decisions.',
      solution:
        "LyRise's data science team built a sophisticated machine learning model using advanced algorithms and comprehensive data analysis. The model incorporated multiple data sources and behavioral patterns to predict repayment likelihood.",
      impact:
        'The AI model achieved 90% accuracy in predicting loan repayments, reduced default rates by 40%, and generated a 5.2x ROI within the first year. The company improved their lending portfolio performance by $2M annually.',
      icon: StairsRoundedIcon,
    },
    {
      index: 3,
      title: 'HR AI Agent',
      description:
        'AI toolkit cut hiring time 80%, cost 50%, boosted talent quality.',
      challenge:
        'An HR department was overwhelmed with recruitment tasks, spending weeks screening candidates and struggling to identify top talent efficiently. Traditional hiring processes were slow and often missed qualified candidates.',
      solution:
        'LyRise developed an intelligent HR AI agent that automated candidate screening, resume analysis, and initial interviews. The system used natural language processing to evaluate candidate responses and match them with job requirements.',
      impact:
        'The HR AI agent reduced hiring time by 80%, cut recruitment costs by 50%, and improved talent quality scores by 35%. The company filled positions 3x faster while maintaining higher candidate satisfaction rates.',
      icon: EscalatorRoundedIcon,
    },
    {
      index: 4,
      title: 'AI Sales Agent',
      description: ' AI Sales Agent drove $15K MRR, cut costs by 65%.',
      challenge:
        "A growing startup needed to scale their sales operations but couldn't afford to hire multiple sales representatives. They required an AI solution to handle lead qualification and initial customer interactions.",
      solution:
        "LyRise created an AI sales agent that could engage with prospects, qualify leads, and schedule meetings. The agent was trained on the company's sales methodology and integrated with their CRM system.",
      impact:
        'The AI Sales Agent generated $15K in monthly recurring revenue, reduced sales operational costs by 65%, and increased lead conversion rates by 40%. The startup scaled their sales capacity without additional headcount.',
      icon: ScatterPlotRoundedIcon,
    },
    {
      index: 5,
      title: 'Targeted Ads via Context-Matching',
      description: 'Doubled output, and improved accuracy of F-Score 50%.',
      challenge:
        'A digital marketing agency struggled with ad targeting accuracy, leading to wasted ad spend and poor campaign performance. They needed an AI solution to improve ad relevance and targeting precision.',
      solution:
        'LyRise developed a context-matching AI system that analyzed user behavior, content consumption patterns, and contextual signals to optimize ad placement. The system continuously learned and adapted to improve targeting accuracy.',
      impact:
        'The AI-powered targeting system doubled campaign output, improved F-Score accuracy by 50%, and reduced cost per acquisition by 35%. The agency increased client retention by 60% and expanded their service offerings.',
      icon: HubRoundedIcon,
    },
  ],
}

// Modal Component
const CaseStudyModal = ({ isOpen, onClose, card }) => {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return () => {}

    const scrollY = window.scrollY
    Object.assign(document.body.style, {
      position: 'fixed',
      top: `-${scrollY}px`,
      left: '0',
      right: '0',
      width: '100%',
      overflow: 'hidden',
    })

    return () => {
      Object.assign(document.body.style, {
        position: '',
        top: '',
        left: '',
        right: '',
        width: '',
        overflow: '',
      })
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  if (!card) return null

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 672, // max-w-2xl equivalent
    maxHeight: '80vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    outline: 'none',
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="case-study-modal-title"
      aria-describedby="case-study-modal-description"
    >
      <Box sx={modalStyle}>
        {/* Fixed Header */}
        <Box sx={{ p: 3, pb: 0, flexShrink: 0 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <card.icon />
              <Typography
                id="case-study-modal-title"
                variant="h4"
                component="h2"
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  color: '#1f2937',
                  fontSize: '1.5rem',
                }}
              >
                {card.title}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{ color: '#6b7280', '&:hover': { color: '#374151' } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ px: 3, flex: 1, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Challenge */}
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  color: '#1f2937',
                  mb: 1.5,
                  fontSize: '1.125rem',
                }}
              >
                Challenge
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#374151',
                  lineHeight: 1.6,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {card.challenge}
              </Typography>
            </Box>

            {/* Solution */}
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  color: '#1f2937',
                  mb: 1.5,
                  fontSize: '1.125rem',
                }}
              >
                Solution
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#374151',
                  lineHeight: 1.6,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {card.solution}
              </Typography>
            </Box>

            {/* Impact */}
            <Box>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  color: '#1f2937',
                  mb: 1.5,
                  fontSize: '1.125rem',
                }}
              >
                Impact
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#374151',
                  lineHeight: 1.6,
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                {card.impact}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Fixed Footer */}
        <Box sx={{ p: 3, pt: 2, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-outfit"
            >
              Close
            </button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

function CaseStudies() {
  const { title, subtitle, cards } = content || {}

  const [isHovered, setIsHovered] = useState({
    isHovered: false,
    index: null,
  })

  const [modalState, setModalState] = useState({
    isOpen: false,
    selectedCard: null,
  })

  const handleCardClick = (card) => {
    setModalState({
      isOpen: true,
      selectedCard: card,
    })
  }

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      selectedCard: null,
    })
  }

  return (
    <>
      <section>
        <div className="w-full flex flex-col gap-12 text-white py-10 mb-12 px-0 mt-[10vh] mb-[10vh]">
          {/* Header Section */}
          <div className="flex flex-col gap-3 xl:mx-[11vw] px-5 xl:px-0">
            <div className="flex flex-col gap-1">
              {/* title */}
              <h3 className="drop-shadow-[0px_0px_12.58px_#B1BAE559] text-[#2C2C2C] font-outfit font-[700] text-[28px] md:text-[30px] lg:text-[40px] lg:w-[30vw]">
                {title}
              </h3>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 w-full xl:px-[11vw] px-5">
            {cards.map((card) => (
              <div
                key={card.index}
                className={`${styles.caseStudyCard} ${
                  isHovered.isHovered && isHovered.index === card.index
                    ? 'xl:hover:scale-[1.1]'
                    : ''
                } cursor-pointer transition-transform duration-300`}
                onMouseEnter={() =>
                  setIsHovered({ isHovered: true, index: card.index })
                }
                onMouseLeave={() =>
                  setIsHovered({ isHovered: false, index: null })
                }
                onClick={() => handleCardClick(card)}
              >
                <div>
                  {card.icon ? (
                    <card.icon className="w-20 h-20" />
                  ) : (
                    <Image
                      src={XboxIconBlack}
                      alt="Xbox Icon"
                      width={50}
                      height={50}
                    />
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2 p-2">
                    <h3 className="text-[17px] font-[500] font-outfit leading-[120%] ">
                      {card.title}
                    </h3>
                    <p className="text-[14px] font-[400] font-outfit leading-[120%]">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <CaseStudyModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        card={modalState.selectedCard}
      />
    </>
  )
}

export default CaseStudies

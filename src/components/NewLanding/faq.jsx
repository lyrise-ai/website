import React from 'react'
import PageSection from '@components/NewLanding/section/PageSection'
import PageSectionTitle from '@components/NewLanding/section/PageSectionTitle'

const questions = [
  {
    id: 1,
    question: 'What services does LyRise Offer?',
    answer: (
      <>
        <span>
          <b>We provide two core services:</b>
        </span>
        <ul>
          <li>
            1. Exponentially accelerating hiring AI and Data talents through our
            LLM, Lyrai.
          </li>
          <li>
            2. Develop Custom AI Agent and solutions tailored to your specific
            needs.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 2,
    question: "What's AIaaS?",
    answer:
      'AIaaS (Artificial Intelligence as a Service) refers to the delivery of AI capabilities via cloud-based platforms, allowing businesses to access and integrate AI technologies without needing to build or maintain their own AI infrastructure. AIaaS offers a range of services such as machine learning, natural language processing, computer vision, and predictive analytics through APIs or ready-made tools. This model allows companies to leverage AI for their business operations with lower upfront costs, faster implementation, and scalability as needed.',
  },
  {
    id: 3,
    question: 'What is Lyrai?',
    answer:
      'Lyrai is our LLM that accelerates hiring AI and Data talents. You simply paste your job description or explain what kind of experience/projects  would you want your talent to have worked on before, and it’ll keep suggesting vetted candidates from our Database',
  },
  {
    id: 4,
    question: 'What does our Database consist of?',
    answer:
      'Our database comprises of AI and Data Talents and Expert Network. They mainly reside in the MENA region, as well as the US and Europe.',
  },
]

export default function FAQ() {
  return (
    <PageSection className="text-center w-full font-primary">
      <PageSectionTitle title="Frequently Asked Questions" />

      <div className="max-w-[1440px] w-[90vw] md:w-[70vw] lg:w-[60vw] m-auto flex flex-col gap-5">
        {questions.map((q) => (
          <Question key={q.id} question={q.question} answer={q.answer} />
        ))}
      </div>
    </PageSection>
  )
}

// a collapsable function that takes in a question and answer
// collapsed by default, on click toggle state to view answer
function Question({ question, answer }) {
  const [collapsed, setCollapsed] = React.useState(true)

  return (
    <div
      className={
        'rounded-lg bg-white cursor-pointer transition-all ease-out duration-300 h-fit border-2 ' +
        (collapsed
          ? 'px-5 border-transparent max-h-[10vh]'
          : 'p-5 !border-blue-500 !max-h-[80vh]')
      }
      onClick={() => setCollapsed(!collapsed)}
    >
      <div className="flex justify-between items-center">
        <div className="text-left text-[1.125rem] font-semibold">
          {question}
        </div>
        <div
          className={
            'text-[1.5rem] font-bold transition-all ease-out relative flex-shrink-0 ' +
            (collapsed
              ? '-rotate-90 my-2'
              : 'rotate-0 bg-blue-500 text-white rounded-full')
          }
        >
          <ArrowSvg />
        </div>
      </div>
      <div
        className={`text-left text-[1rem] font-secondary text-neutral-500 mt-3 ${
          collapsed ? 'hidden' : 'block'
        }`}
      >
        {answer}
      </div>
    </div>
  )
}

const ArrowSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="51"
      height="51"
      viewBox="0 0 51 51"
      fill="none"
    >
      <path
        d="M17.2305 22.2432L25.4871 30.4624L33.7436 22.2432"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

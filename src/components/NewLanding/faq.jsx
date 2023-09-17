import React from 'react'

const questions = [
  {
    id: 1,
    question: 'Who is LyRise for?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 2,
    question: 'Can I subcontract a project to LyRise?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 3,
    question: 'How long does the matching process take?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    id: 4,
    question: 'How will LyRise help me manage my remote AI team?',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

export default function FAQ() {
  return (
    <div className="text-center w-full mt-32">
      <h1 className="text-4xl max-w-[500px] m-auto font-semibold mb-20">
        Frequently Asked Questions
      </h1>

      <div className="max-w-[1440px] w-[90vw] md:w-[70vw] lg:w-[60vw] m-auto flex flex-col gap-5">
        {questions.map((q) => (
          <Question key={q.id} question={q.question} answer={q.answer} />
        ))}
      </div>
    </div>
  )
}

// a collapsable function that takes in a question and answer
// collapsed by default, on click toggle state to view answer
function Question({ question, answer }) {
  const [collapsed, setCollapsed] = React.useState(true)

  return (
    <div
      className={
        'p-5 rounded-lg bg-white cursor-pointer transition-all duration-300 h-[8vh] border-2 ' +
        (collapsed ? 'border-transparent' : '!border-blue-500 !h-[16vh]')
      }
      onClick={() => setCollapsed(!collapsed)}
    >
      <div className="flex justify-between items-center">
        <div className="text-left text-[1.125rem] font-semibold font-secondary">
          {question}
        </div>
        <div
          className={
            'text-[1.5rem] font-bold transition-all relative ' +
            (collapsed
              ? '-rotate-90'
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
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

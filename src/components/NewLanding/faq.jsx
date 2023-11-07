import React from 'react'

const questions = [
  {
    id: 1,
    question: 'Who is LyRise for?',
    answer:
      'Tech companies looking for faster and more efficient access to remote AI, Data & Software talent.',
  },
  {
    id: 2,
    question: 'Can I subcontract a project to LyRise?',
    answer:
      'Yes. If you’re not looking to hire at the moment, you can work with our talents on a project basis and leave the hassle of HR to us. You can select our Talent As A Service (TAaS), LyRise will then act as your Employer of Record (EoR) building the team, manages your payroll, up or down-scales the team, performs regular performance reviews, provides technical support, security services all in one as well as other perks--sign up to find out more!',
  },
  {
    id: 3,
    question: 'How long does the matching process take?',
    answer:
      'It takes as little as 14 days for the roles listed above, whereas more specialized roles may require more time.',
  },
  {
    id: 4,
    question: 'How will LyRise help me manage my remote AI team?',
    answer:
      'We have top-notch engagement managers, AI, Data & Software product managers, and senior experts who can help you build and manage your remote AI & Data team.',
  },
]

export default function FAQ() {
  return (
    <div className="text-center w-full mt-32 font-primary">
      <h1 className="text-4xl max-w-[500px] m-auto font-medium mb-20">
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
        'rounded-lg bg-white cursor-pointer transition-all ease-out duration-300 h-fit border-2 ' +
        (collapsed
          ? 'px-5 border-transparent max-h-[10vh]'
          : 'p-5 !border-blue-500 !max-h-[60vh]')
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
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}

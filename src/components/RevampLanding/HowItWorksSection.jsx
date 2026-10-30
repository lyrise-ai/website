import React from 'react'

/**
 * HowItWorksSection
 *
 * Converted to pure Tailwind CSS:
 * - 3 structured implementation steps with buyer hour allocations
 * - High-contrast cards with deliverable tags and 3:1 guarantee proof
 */
export default function HowItWorksSection() {
  const steps = [
    {
      num: '01 · Find It',
      title: 'The AI Profit Map',
      time: '3 hours your team · Free',
      desc: 'We interview practice leaders and rank repeated workflows by financial yield. Delivered in 72 hours to keep.',
      deliverable: '6 Workflows Mapped · Baseline Audit',
    },
    {
      num: '02 · Secure It',
      title: 'Agent Job Description & Build',
      time: '5 hours your team · Weeks 2–4',
      desc: 'We write the Agent Job Description and deploy the custom agent inside your existing CRM/billing software.',
      deliverable: 'Private SOC-2 VPC · Human-in-Loop Screens',
    },
    {
      num: '03 · Multiply It',
      title: 'Managed for Profit Monthly Scorecard',
      time: '8 hours your team · Weeks 4–12',
      desc: 'We audit prompt drift, accuracy, and exception rates every 30 days to verify the 3:1 return in writing.',
      deliverable: 'Monthly Drift Audit · 3:1 Guarantee Signed',
    },
  ]

  return (
    <section className="py-20 md:py-24 px-6 bg-[#f7f8f7] relative" id="how">
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[760px] mb-12">
          <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2.5">
            How It Works
          </span>
          <h2 className="font-sans text-[clamp(28px,3.2vw,42px)] font-extrabold leading-[1.18] tracking-tight text-[#000022] mb-3.5">
            From First Interview to Live AI Agent in 16 Total Buyer Hours
          </h2>
          <p className="text-[clamp(16px,1.4vw,18px)] text-[#4a4e69] leading-relaxed">
            No endless steering committees. Exactly 16 hours of your team’s time
            across 6 weeks.
          </p>
        </div>

        {/* 3 Streamlined Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-white border border-[#000022]/8 rounded-2xl p-7 md:p-8 relative transition-all duration-250 hover:border-[#6666ff] hover:shadow-xl hover:shadow-[#6666ff]/10 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="font-mono text-[12.5px] font-bold text-[#6666ff] tracking-wider uppercase mb-3">
                  {st.num}
                </div>
                <h3 className="font-sans text-[22px] font-bold tracking-tight text-[#000022] mb-2.5">
                  {st.title}
                </h3>
                <div className="inline-block bg-[#6666ff]/10 text-[#6666ff] px-2.5 py-1 rounded-full text-xs font-semibold mb-4">
                  {st.time}
                </div>
                <p className="text-sm text-[#555566] leading-relaxed mb-4">
                  {st.desc}
                </p>
              </div>

              <div className="border-t border-[#000022]/8 pt-3 text-xs text-[#4200ff] font-semibold font-mono mt-auto">
                ✓ {st.deliverable}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState } from 'react'
import {
  QUANTRAX_STEP1_WORKFLOWS,
  QUANTRAX_JOB_DESCRIPTION,
} from './data/verifiedFacts'

/**
 * AgentInActionDemo
 *
 * Converted to pure Tailwind CSS:
 * - 3-tab interactive deliverables inspector (Profit Map, Live Agent Spec & Video, Audit Scorecard)
 * - Pure Tailwind responsive tables and video containers
 */
export default function AgentInActionDemo() {
  const [activeTab, setActiveTab] = useState('tab-map')

  return (
    <div className="bg-white border border-[#000022]/8 rounded-2xl shadow-xl shadow-[#000022]/4 overflow-hidden">
      {/* 3 Tab Navigation Controls */}
      <div className="flex bg-[#f7f8f7] border-b border-[#000022]/8 flex-wrap">
        <button
          type="button"
          className={`flex-1 min-w-[180px] py-4 px-5 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-2 ${
            activeTab === 'tab-map'
              ? 'text-[#6666ff] bg-white border-b-[#6666ff]'
              : 'text-[#4a4e69] hover:text-[#000022] border-transparent'
          }`}
          onClick={() => setActiveTab('tab-map')}
        >
          01 · The AI Profit Map
        </button>
        <button
          type="button"
          className={`flex-1 min-w-[180px] py-4 px-5 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-2 ${
            activeTab === 'tab-agent'
              ? 'text-[#6666ff] bg-white border-b-[#6666ff]'
              : 'text-[#4a4e69] hover:text-[#000022] border-transparent'
          }`}
          onClick={() => setActiveTab('tab-agent')}
        >
          02 · Live Agent & Job Description
        </button>
        <button
          type="button"
          className={`flex-1 min-w-[180px] py-4 px-5 text-sm font-semibold cursor-pointer transition-all duration-200 border-b-2 ${
            activeTab === 'tab-scorecard'
              ? 'text-[#6666ff] bg-white border-b-[#6666ff]'
              : 'text-[#4a4e69] hover:text-[#000022] border-transparent'
          }`}
          onClick={() => setActiveTab('tab-scorecard')}
        >
          03 · Managed for Profit Scorecard
        </button>
      </div>

      {/* Tab Content 1: AI Profit Map Table */}
      {activeTab === 'tab-map' && (
        <div className="p-6 md:p-9">
          <div className="mb-5 flex justify-between items-center flex-wrap gap-3">
            <div>
              <h4 className="text-lg font-extrabold text-[#000022] mb-1">
                Quantrax Deliverable 01 · 6-Workflow Operations Map
              </h4>
              <p className="text-[13px] text-[#555566] m-0">
                Delivered in 72 hours following 3 hours of interviews with
                Quantrax department operations leads.
              </p>
            </div>
            <span className="font-mono text-[10.5px] font-semibold text-[#008e87] bg-[#e6f9f8] border border-[#00b8b0]/30 rounded px-2.5 py-1 tracking-wider">
              Verified Client Map
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  <th className="font-mono text-left py-3 px-3.5 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8">
                    Workflow Name
                  </th>
                  <th className="font-mono text-left py-3 px-3.5 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8">
                    Frequency
                  </th>
                  <th className="font-mono text-left py-3 px-3.5 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8">
                    Before LyRise
                  </th>
                  <th className="font-mono text-left py-3 px-3.5 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8">
                    After (AI Agent)
                  </th>
                  <th className="font-mono text-left py-3 px-3.5 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8">
                    Hours Returned
                  </th>
                  <th className="font-mono text-left py-3 px-3.5 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8">
                    Profit Uplift
                  </th>
                  <th className="font-mono text-left py-3 px-3.5 bg-[#f7f8f7] text-[#4a4e69] font-semibold text-[11.5px] uppercase tracking-wider border-b border-[#000022]/8">
                    Data Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {QUANTRAX_STEP1_WORKFLOWS.map((wf) => (
                  <tr key={wf.name} className="hover:bg-[#fcfdfe]">
                    <td className="py-3.5 px-3.5 border-b border-[#000022]/8 font-semibold text-[#000022]">
                      {wf.name}
                    </td>
                    <td className="py-3.5 px-3.5 border-b border-[#000022]/8 text-[#555566]">
                      {wf.freq}
                    </td>
                    <td className="py-3.5 px-3.5 border-b border-[#000022]/8 text-[#888899]">
                      {wf.timeBefore}
                    </td>
                    <td className="py-3.5 px-3.5 border-b border-[#000022]/8 text-[#008f88] font-semibold">
                      {wf.timeAfter}
                    </td>
                    <td className="py-3.5 px-3.5 border-b border-[#000022]/8 font-bold text-[#000022]">
                      {wf.hoursReturned}
                    </td>
                    <td className="py-3.5 px-3.5 border-b border-[#000022]/8 font-extrabold text-[#008f88]">
                      {wf.financialGain}
                    </td>
                    <td className="py-3.5 px-3.5 border-b border-[#000022]/8">
                      <span className="font-mono text-[10.5px] font-semibold text-[#008e87] bg-[#e6f9f8] border border-[#00b8b0]/30 rounded px-2 py-0.5 tracking-wider">
                        {wf.provenance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-4 md:p-5 bg-[#f7f8f7] rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="text-[13px] text-[#555566]">
              <strong className="text-[#000022]">Map Totals:</strong> 10,000
              Hours Returned / yr · $394,000 Total Financial Gain identified
            </div>
            <a
              href="#calculator"
              className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-semibold rounded-full border border-[#000022]/15 text-[#000022] hover:bg-[#ffffff] hover:border-[#000022]/30 transition-all duration-200"
            >
              Map Your Firm’s Workflows →
            </a>
          </div>
        </div>
      )}

      {/* Tab Content 2: Live Agent + Job Description */}
      {activeTab === 'tab-agent' && (
        <div className="p-6 md:p-9">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">
            {/* Left: Job Description Spec Card */}
            <div className="bg-[#f7f8f7] border border-[#000022]/8 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3.5">
                <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#6666ff]/12 text-[#4200ff]">
                  AI Employee Spec
                </span>
                <span className="text-xs text-[#888899]">
                  Version 2.4 · Live
                </span>
              </div>
              <h4 className="text-[17px] font-extrabold text-[#000022] mb-1.5">
                {QUANTRAX_JOB_DESCRIPTION.agentTitle}
              </h4>
              <p className="text-xs text-[#555566] mb-4">
                Supervised by: {QUANTRAX_JOB_DESCRIPTION.supervisingExecutive}
              </p>

              <div className="text-[13px] text-[#333344] mb-4 leading-relaxed">
                {QUANTRAX_JOB_DESCRIPTION.primaryPurpose}
              </div>

              <div className="mb-3.5">
                <div className="text-[11px] font-bold uppercase text-[#008f88] mb-1.5">
                  What the AI Agent Executes (1.4s)
                </div>
                <ul className="m-0 pl-4.5 text-[12.5px] text-[#444455] leading-relaxed list-disc">
                  {QUANTRAX_JOB_DESCRIPTION.responsibilitiesAI.map(
                    (item, i) => (
                      <li key={i}>{item}</li>
                    ),
                  )}
                </ul>
              </div>

              <div>
                <div className="text-[11px] font-bold uppercase text-[#4200ff] mb-1.5">
                  What Human Collectors Keep
                </div>
                <ul className="m-0 pl-4.5 text-[12.5px] text-[#444455] leading-relaxed list-disc">
                  {QUANTRAX_JOB_DESCRIPTION.responsibilitiesHumans.map(
                    (item, i) => (
                      <li key={i}>{item}</li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* Right: Real Agent Video Demo */}
            <div>
              <div className="rounded-2xl overflow-hidden border border-[#000022]/10 shadow-xl bg-[#000022] relative">
                <video
                  src="/assets/site/demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full h-auto block"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#666677]">
                <span>Real Quantrax platform execution</span>
                <span className="font-mono text-[10.5px] font-semibold text-[#008e87] bg-[#e6f9f8] border border-[#00b8b0]/30 rounded px-2.5 py-1 tracking-wider">
                  1.4s Response Time
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Managed for Profit Monthly Scorecard */}
      {activeTab === 'tab-scorecard' && (
        <div className="p-6 md:p-9">
          <div className="mb-6">
            <h4 className="text-lg font-extrabold text-[#000022] mb-1.5">
              Deliverable 03 · Month 3 Executive Guarantee Audit
            </h4>
            <p className="text-[13px] text-[#555566] m-0">
              Every month, Joseph audits actual Hours Returned against the
              baseline to guarantee the 3:1 return in writing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            <div className="bg-[#f7f8f7] p-5 rounded-2xl border border-[#000022]/8">
              <div className="text-xs text-[#777788] font-semibold">
                Month 1 · Pilot
              </div>
              <div className="text-2xl font-extrabold text-[#000022] my-1.5">
                1,800 hrs
              </div>
              <div className="text-xs text-[#008f88] font-semibold">
                1.8:1 Return Ratio
              </div>
              <div className="text-[11px] text-[#888899] mt-1">
                12 collectors active
              </div>
            </div>

            <div className="bg-[#f7f8f7] p-5 rounded-2xl border border-[#000022]/8">
              <div className="text-xs text-[#777788] font-semibold">
                Month 2 · Ramp
              </div>
              <div className="text-2xl font-extrabold text-[#000022] my-1.5">
                4,400 hrs
              </div>
              <div className="text-xs text-[#008f88] font-semibold">
                2.9:1 Return Ratio
              </div>
              <div className="text-[11px] text-[#888899] mt-1">
                38 collectors active
              </div>
            </div>

            <div className="bg-[#00b8b0]/10 p-5 rounded-2xl border border-[#00b8b0]/30">
              <div className="text-xs text-[#007a74] font-bold">
                Month 3 · Guarantee Met
              </div>
              <div className="text-2xl font-black text-[#000022] my-1.5">
                10,000 hrs / yr
              </div>
              <div className="text-sm text-[#008f88] font-extrabold">
                3.6:1 Verified Return
              </div>
              <div className="text-[11px] text-[#007a74] mt-1">
                All 65 team members active
              </div>
            </div>
          </div>

          <div className="p-4.5 md:p-5 bg-[#000022] text-white rounded-xl flex items-center justify-between flex-wrap gap-3">
            <span className="text-[13px] text-[#b0b4c8]">
              The 3:1 Guarantee is signed in writing prior to Step 2 build
              commencement.
            </span>
            <a
              href={QUANTRAX_STEP1_WORKFLOWS[0] ? '#pricing' : '#'}
              className="inline-flex items-center justify-center px-4.5 py-2 text-[13px] font-semibold rounded-full bg-[#6666ff] text-white shadow-md shadow-[#6666ff]/25 hover:bg-[#4200ff] transition-all duration-200"
            >
              View Guarantee Terms ↓
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

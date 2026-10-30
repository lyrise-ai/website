import React from 'react'

/**
 * ProblemSection
 *
 * Converted to pure Tailwind CSS:
 * - Operating ratio comparison (58% work-about-work leak vs 42% billable)
 * - Symmetrical 2-column comparison (Copilot seats vs LyRise custom autonomous agents)
 */
export default function ProblemSection() {
  return (
    <section className="py-20 md:py-24 px-6 bg-white relative" id="problem">
      <div className="max-w-[1240px] mx-auto">
        {/* Compact & Symmetrical Top Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6 lg:gap-9 items-end mb-6">
          <div>
            <span className="inline-block font-mono text-[11.5px] font-semibold uppercase tracking-wider text-[#6666ff] mb-2.5">
              The Operating Leak
            </span>
            <div className="flex items-baseline gap-4 my-1 flex-wrap">
              <span className="text-[clamp(44px,5vw,60px)] font-black leading-none text-[#6666ff] tracking-tight shrink-0">
                58%
              </span>
              <h3 className="text-[clamp(20px,2.2vw,24px)] font-extrabold text-[#000022] tracking-tight leading-snug m-0">
                Of your team’s week is work about work.
              </h3>
            </div>
            <p className="text-sm text-[#555566] leading-relaxed max-w-[620px] m-0">
              Paralegals, accountants, and consultants spend only 42% of their
              day on billable judgment. The rest is consumed by re-keying data,
              reading past notes, and chasing completeness across software tabs.
            </p>
          </div>

          <div className="bg-white border border-[#000022]/8 rounded-xl p-3.5 md:p-4 shadow-sm shadow-[#000022]/2">
            <div className="h-2 w-full rounded-full bg-[#000022]/6 overflow-hidden flex mb-2.5">
              <div
                className="h-full bg-[#00b8b0] transition-all duration-300"
                style={{ width: '42%' }}
                title="42% High-value client work"
              />
              <div
                className="h-full bg-[#6666ff] transition-all duration-300"
                style={{ width: '58%' }}
                title="58% Manual workflow toil"
              />
            </div>
            <div className="flex justify-between gap-3 text-xs text-[#555566]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00b8b0] inline-block" />
                <strong>42%</strong>
                <span>High-value client work</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#6666ff] inline-block" />
                <strong>58%</strong>
                <span>Manual workflow toil</span>
              </div>
            </div>
          </div>
        </div>

        {/* Symmetrical 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Card 1: What Vendors Sell You */}
          <div className="flex flex-col justify-between bg-white border border-[#000022]/8 rounded-2xl p-4.5 md:p-5 shadow-sm shadow-[#000022]/2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#000022]/15">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#666677] inline-flex items-center gap-1.5">
                  01 // Generic Copilots
                </span>
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#000022]/4 text-[#666677] border border-[#000022]/8">
                  Status: Disconnected
                </span>
              </div>

              <h4 className="text-base font-bold text-[#000022] mb-1 tracking-tight">
                Copilot licenses & empty chat prompts
              </h4>
              <p className="text-[13px] text-[#555566] leading-relaxed mb-2.5">
                Your team receives a $30/month chatbot seat in a browser tab.
                They copy-paste case files, guess at prompts, and fix
                hallucinations.
              </p>

              {/* Micro-Artifact */}
              <div className="bg-[#f8f9fa] border border-[#000022]/6 rounded-lg p-2.5 md:p-3 mb-3">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#777788] bg-white border border-[#000022]/8 rounded px-2 py-1 mb-2">
                  <span className="text-[11px] opacity-70">💬</span>
                  <span>
                    Prompt: &ldquo;Paste 45-page transcript and
                    summarize...&rdquo;
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs leading-snug text-[#555566]">
                  <div className="flex items-start gap-1.5">
                    <span className="font-mono text-[10.5px] font-bold text-amber-600 shrink-0 mt-0.5">
                      [ ✕ ]
                    </span>
                    <span>
                      No ERP / CRM connection — manual copy-paste across tabs
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-mono text-[10.5px] font-bold text-amber-600 shrink-0 mt-0.5">
                      [ ✕ ]
                    </span>
                    <span>
                      Zero audit trail — hallucination risk on legal & financial
                      numbers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 items-center font-mono text-[10.5px] text-[#777788] pt-2 border-t border-[#000022]/6">
              <span>Seat: $30/user/mo</span>
              <span>•</span>
              <span>Redesign: 0%</span>
              <span>•</span>
              <span>Guaranteed Yield: $0</span>
            </div>
          </div>

          {/* Card 2: What LyRise Builds */}
          <div className="flex flex-col justify-between bg-gradient-to-b from-white to-[#fafaff] border border-[#6666ff]/25 rounded-2xl p-4.5 md:p-5 shadow-sm shadow-[#6666ff]/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#6666ff]/40">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-[#666677] inline-flex items-center gap-1.5">
                  02 // Autonomous Systems
                </span>
                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00b8b0]/10 text-[#008780] border border-[#00b8b0]/25">
                  3:1 Guarantee Signed
                </span>
              </div>

              <h4 className="text-base font-bold text-[#000022] mb-1 tracking-tight">
                Custom agents with Job Descriptions & 3:1 Guarantees
              </h4>
              <p className="text-[13px] text-[#555566] leading-relaxed mb-2.5">
                We map your operations, define exact boundaries, and commission
                custom agents that trigger directly inside your core software.
              </p>

              {/* Micro-Artifact */}
              <div className="bg-white border border-[#6666ff]/20 rounded-lg p-2.5 md:p-3 mb-3 shadow-xs">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#000022] bg-[#6666ff]/5 border border-[#6666ff]/15 rounded px-2 py-1 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00b8b0] shadow-[0_0_0_2px_rgba(0,184,176,0.2)] inline-block" />
                  <span>
                    TRIGGER: NetSuite / Clio ledger → &ldquo;Pending
                    Review&rdquo;
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 text-xs leading-snug text-[#555566]">
                  <div className="flex items-start gap-1.5">
                    <span className="font-mono text-[10.5px] font-bold text-[#008780] shrink-0 mt-0.5">
                      [ ✓ ]
                    </span>
                    <span>
                      Autonomous 3-way reconciliation completed in 1.4s (Zero
                      drift)
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-mono text-[10.5px] font-bold text-[#008780] shrink-0 mt-0.5">
                      [ ✓ ]
                    </span>
                    <span>
                      Zero-drift compliance boundary enforced · Immutable audit
                      log
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 items-center font-mono text-[10.5px] text-[#777788] pt-2 border-t border-[#000022]/6">
              <span>Trigger: Native API</span>
              <span>•</span>
              <span>Hours Returned: 40 hrs/mo</span>
              <span>•</span>
              <span>Contract: 3:1 Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

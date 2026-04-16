import React, { useState, useRef, useCallback } from 'react'
import { drainSSE } from '@/src/lib/drainSSE'

const SUGGEST_RE = /\[SUGGEST:\s*([^\]]+)\]$/
function parseSuggestions(content) {
  const m = content.match(SUGGEST_RE)
  if (!m) return { clean: content, chips: [] }
  return {
    clean: content.replace(SUGGEST_RE, '').trimEnd(),
    chips: m[1].split('|').map(s => s.trim()).filter(Boolean),
  }
}

function buildInitialMessage(state) {
  const isLow = state?.confidenceLevel === 'low'
  const inferredWfs = state?.researchOutput?.workflows?.filter(w => w.sourceType === 'inferred') ?? []
  const noRevenue = !state?.revenueAnchor
  const company = state?.assembled?.roi_data?.company ?? 'your company'

  if (!isLow && !inferredWfs.length && !noRevenue) {
    return {
      text: `Report ready for ${company}. Ask me to adjust any numbers, rewrite sections, or research more context.`,
      chips: ['Update a workflow volume', 'Rewrite the executive summary', 'Change the currency'],
    }
  }

  const gaps = []
  if (noRevenue) gaps.push('revenue figure (needed for accuracy)')
  inferredWfs.forEach(w => gaps.push(`"${w.name}" — volume and time estimates (currently inferred)`))
  const gapLines = gaps.map(g => `- ${g}`).join('\n')

  const text = isLow
    ? `I've produced a **hypothesis-driven estimate** — most figures are benchmarked, not scraped. Here's what would most improve accuracy:\n\n${gapLines}\n\nWant to provide any of these?`
    : "Report ready. A few figures are estimated — here's the most impactful thing you could confirm:"

  const chips = []
  if (noRevenue) chips.push("What's your approximate annual revenue?")
  if (inferredWfs[0]) chips.push(`Confirm volume for "${inferredWfs[0].name}"`)
  chips.push("Looks good, let's move forward")
  chips.push('What else can you improve?')

  return { text, chips: chips.slice(0, 4) }
}

// Human-readable labels for each tool call
const TOOL_LABELS = {
  web_search: 'Searching the web…',
  fetch_page: 'Reading page…',
  set_research_output: 'Processing research findings…',
  run_financial_model: 'Running financial model…',
  set_report_copy: 'Writing report copy…',
  update_cta: 'Updating CTA…',
  update_unified_thesis: 'Updating executive summary…',
  update_profit_levers: 'Updating profit levers…',
  update_resilience_rows: 'Updating resilience section…',
  update_cost_of_delay: 'Updating cost of delay…',
  update_risks: 'Updating risks…',
  update_next_steps: 'Updating next steps…',
  update_pilot_recommendation: 'Updating pilot recommendation…',
  update_workflow_assumption: 'Recalculating figures…',
  rewrite_report_copy: 'Rewriting report copy…',
  add_workflow: 'Adding workflow…',
  remove_workflow: 'Removing workflow…',
}

export default function ReportViewer({ initialState, email }) {
  const [reportState, setReportState] = useState(initialState)
  const [chatHistory, setChatHistory] = useState([])
  const [suggestions, setSuggestions] = useState(() => buildInitialMessage(initialState).chips)
  const [streamingText, setStreamingText] = useState('')
  const [activeTool, setActiveTool] = useState(null)
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [input, setInput] = useState('')
  const [emailStatus, setEmailStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'

  const iframeRef = useRef(null)

  const renderedHtml = reportState?.renderedHtml ?? initialState?.renderedHtml
  const company = reportState?.assembled?.roi_data?.company ?? ''

  const handleSend = useCallback(async (e, overrideMsg) => {
    e?.preventDefault()
    const msg = (overrideMsg ?? input).trim()
    if (!msg || isAgentRunning) return

    const newHistory = [...chatHistory, { role: 'user', content: msg }]
    if (!overrideMsg) setInput('')
    setSuggestions([])
    setIsAgentRunning(true)
    setStreamingText('')
    setActiveTool(null)

    try {
      const res = await fetch('/api/roi-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'chat',
          message: msg,
          chatHistory: newHistory,
          state: reportState,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      let agentReply = ''
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      await drainSSE(reader, decoder, (event) => {
        if (event.type === 'text_delta') {
          agentReply += event.delta
          setStreamingText(agentReply)
        } else if (event.type === 'tool_start') {
          setActiveTool(TOOL_LABELS[event.tool] ?? event.tool)
        } else if (event.type === 'report_update') {
          setReportState(event.state)
          setActiveTool(null)
        } else if (event.type === 'done') {
          if (agentReply) {
            const { clean, chips } = parseSuggestions(agentReply)
            setChatHistory(newHistory.concat([{ role: 'assistant', content: clean }]))
            setSuggestions(chips)
          }
          setStreamingText('')
          setIsAgentRunning(false)
          setActiveTool(null)
        } else if (event.type === 'error') {
          setStreamingText('')
          setIsAgentRunning(false)
          setActiveTool(null)
        }
      })
    } catch {
      setIsAgentRunning(false)
      setActiveTool(null)
    }
  }, [input, isAgentRunning, chatHistory, reportState])

  const handleDownload = useCallback(() => {
    iframeRef.current?.contentWindow?.print()
  }, [])

  const handleResendEmail = useCallback(async () => {
    if (emailStatus === 'sending') return
    setEmailStatus('sending')
    try {
      const res = await fetch('/api/roi-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: reportState }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setEmailStatus('sent')
      setTimeout(() => setEmailStatus('idle'), 3000)
    } catch {
      setEmailStatus('error')
      setTimeout(() => setEmailStatus('idle'), 3000)
    }
  }, [emailStatus, reportState])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', borderBottom: '1px solid #e2e8f0', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', zIndex: 10, flexShrink: 0,
      }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
          {company} — AI ROI Report
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={handleDownload}
            style={{
              padding: '6px 14px', fontSize: 13, fontWeight: 500,
              border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff',
              color: '#374151', cursor: 'pointer',
            }}
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={emailStatus === 'sending'}
            style={{
              padding: '6px 14px', fontSize: 13, fontWeight: 500,
              border: '1px solid #2957FF', borderRadius: 6,
              background: emailStatus === 'sent' ? '#dcfce7' : emailStatus === 'error' ? '#fee2e2' : '#2957FF',
              color: emailStatus === 'sent' ? '#166534' : emailStatus === 'error' ? '#991b1b' : '#fff',
              cursor: emailStatus === 'sending' ? 'not-allowed' : 'pointer', opacity: emailStatus === 'sending' ? 0.7 : 1,
            }}
          >
            {emailStatus === 'sending' ? 'Sending…' : emailStatus === 'sent' ? 'Email Sent!' : emailStatus === 'error' ? 'Send Failed' : 'Re-send Email'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Report iframe (65% width) */}
        <div style={{ flex: '0 0 65%', overflow: 'hidden', borderRight: '1px solid #e2e8f0', background: '#f1f5f9' }}>
          <iframe
            ref={iframeRef}
            srcDoc={renderedHtml ?? ''}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="ROI Report Preview"
          />
        </div>

        {/* Chat panel (35% width) */}
        <div style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
          {/* Status / streaming area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Suggestion chips */}
            {suggestions.length > 0 && !isAgentRunning && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSuggestions([]); handleSend(null, s) }}
                    style={{
                      background: '#fff', border: '1px solid #2957FF', borderRadius: 16,
                      color: '#2957FF', padding: '4px 12px', fontSize: 12, cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Streaming text (currently typing) */}
            {streamingText && (
              <div style={{
                padding: '8px 12px', borderRadius: 8,
                background: '#f1f5f9', color: '#1a1a1a', fontSize: 13, lineHeight: 1.55, wordBreak: 'break-word',
              }}>
                {streamingText}
                <span style={{ display: 'inline-block', width: 6, height: 6, background: '#2957FF', borderRadius: '50%', marginLeft: 4, animation: 'pulse 1s infinite' }} />
              </div>
            )}

            {/* Tool indicator */}
            {activeTool && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2957FF', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: 12, color: '#5a5a6e', fontStyle: 'italic' }}>{activeTool}</span>
              </div>
            )}

            {/* Placeholder when idle */}
            {!isAgentRunning && !streamingText && !activeTool && suggestions.length === 0 && (
              <div style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>
                Ask me to adjust any numbers, rewrite sections, or add context.
              </div>
            )}
          </div>

          {/* Input area */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to change anything in the report…"
                disabled={isAgentRunning}
                rows={2}
                style={{
                  flex: 1, padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
                  fontSize: 13, lineHeight: 1.5, resize: 'none', outline: 'none',
                  fontFamily: 'inherit', color: '#1a1a1a',
                  background: isAgentRunning ? '#f9fafb' : '#fff',
                }}
              />
              <button
                type="submit"
                disabled={isAgentRunning || !input.trim()}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none',
                  background: isAgentRunning || !input.trim() ? '#e2e8f0' : '#2957FF',
                  color: isAgentRunning || !input.trim() ? '#94a3b8' : '#fff',
                  fontWeight: 600, fontSize: 13, cursor: isAgentRunning || !input.trim() ? 'not-allowed' : 'pointer',
                  alignSelf: 'flex-end',
                }}
              >
                Send
              </button>
            </form>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0 0' }}>
              Ask to update numbers, rewrite sections, or research additional context.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}

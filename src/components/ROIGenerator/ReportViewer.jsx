import React, { useState, useRef, useCallback, useEffect } from 'react'
import { drainSSE } from '@/src/lib/drainSSE'

const SUGGEST_RE = /\[SUGGEST:\s*([^\]]+)\]$/
function parseSuggestions(content) {
  const m = content.match(SUGGEST_RE)
  if (!m) return { clean: content, chips: [] }
  return {
    clean: content.replace(SUGGEST_RE, '').trimEnd(),
    chips: m[1]
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean),
  }
}

function buildInitialMessage(state) {
  const isLow = state?.confidenceLevel === 'low'
  const inferredWfs =
    state?.researchOutput?.workflows?.filter(
      (w) => w.sourceType === 'inferred',
    ) ?? []
  const noRevenue = !state?.revenueAnchor
  const company = state?.assembled?.roi_data?.company ?? 'your company'

  const parts = []

  if (isLow) {
    parts.push(
      `Report ready for ${company}. Most figures are benchmarked estimates — not scraped from live data.`,
    )
  } else {
    parts.push(`Report ready for ${company}.`)
  }

  const gaps = []
  if (noRevenue) gaps.push('annual revenue (improves profit uplift accuracy)')
  inferredWfs
    .slice(0, 2)
    .forEach((w) =>
      gaps.push(`volume for "${w.name}" (currently estimated from benchmarks)`),
    )
  if (gaps.length) {
    parts.push(`To sharpen the numbers, you could share: ${gaps.join('; ')}.`)
  }

  parts.push(
    'Ask me to adjust any figures, rewrite sections, change the currency, or add more context.',
  )

  return parts.join(' ')
}

// Human-readable labels for each tool call
const TOOL_LABELS = {
  web_search: 'Searching the web…',
  fetch_page: 'Reading page…',
  set_research_output: 'Processing research findings…',
  run_financial_model: 'Running financial model…',
  set_report_copy: 'Writing report copy…',
  update_copy: 'Updating report copy…',
  update_workflow: 'Recalculating figures…',
  update_globals: 'Updating financial model…',
  scale_rates: 'Scaling figures…',
  set_currency: 'Updating currency…',
  add_workflow: 'Adding workflow…',
  remove_workflow: 'Removing workflow…',
}

const SECTION_LABELS = {
  financials: 'KPI Bar',
  thesis: 'The Pattern Underneath',
  workflows: 'Before vs. After AI',
  profit_levers: 'Profit Uplift',
  cost_of_delay: 'Cost of Delay',
  cta: 'What Happens Next',
  resilience_rows: 'Resilience Table',
  risks: 'Risks & Mitigations',
  pilot: 'Pilot Recommendation',
}

// Render **bold** markdown from agent responses
function renderText(text) {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      ),
    )
}

export default function ReportViewer({ initialState, email }) {
  const [reportState, setReportState] = useState(initialState)
  const [chatHistory, setChatHistory] = useState([])
  const [initialMessage] = useState(() => buildInitialMessage(initialState))
  const [streamingText, setStreamingText] = useState('')
  const [activeTool, setActiveTool] = useState(null)
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [input, setInput] = useState('')
  const [emailStatus, setEmailStatus] = useState('idle')
  const [activeTab, setActiveTab] = useState('exec')
  const [lastChangedSections, setLastChangedSections] = useState([])

  const iframeRef = useRef(null)
  const messagesEndRef = useRef(null)
  const pendingHighlightsRef = useRef([])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory, streamingText, activeTool])

  const applySectionHighlights = useCallback((doc, sections) => {
    if (!doc?.body?.querySelector('[data-section]')) return false
    sections.forEach((section) => {
      doc.querySelectorAll(`[data-section="${section}"]`).forEach((el) => {
        el.classList.add('section-highlighted')
      })
    })
    return true
  }, [])

  // Fallback: if srcDoc didn't change, onLoad won't fire — apply highlights directly.
  useEffect(() => {
    const sections = pendingHighlightsRef.current
    if (!sections.length) return
    const doc = iframeRef.current?.contentDocument
    if (!applySectionHighlights(doc, sections)) return
    pendingHighlightsRef.current = []
  }, [reportState, applySectionHighlights])

  const activeHtml =
    activeTab === 'exec'
      ? reportState?.renderedHtml ?? initialState?.renderedHtml
      : reportState?.renderedFullHtml ?? initialState?.renderedFullHtml
  const company = reportState?.assembled?.roi_data?.company ?? ''

  const handleSend = useCallback(
    async (e, overrideMsg) => {
      e?.preventDefault()
      const msg = (overrideMsg ?? input).trim()
      if (!msg || isAgentRunning) return

      const newHistory = [...chatHistory, { role: 'user', content: msg }]
      setChatHistory(newHistory)
      if (!overrideMsg) setInput('')
      setIsAgentRunning(true)
      setLastChangedSections([])
      // Clear any section highlights from the previous agent response
      iframeRef.current?.contentDocument
        ?.querySelectorAll('.section-highlighted')
        .forEach((el) => el.classList.remove('section-highlighted'))
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
            pendingHighlightsRef.current = event.changedSections ?? []
            setLastChangedSections((prev) =>
              [...new Set([...prev, ...(event.changedSections ?? [])])]
            )
            setReportState(event.state)
            setActiveTool(null)
          } else if (event.type === 'done') {
            const { clean } = parseSuggestions(agentReply)
            const nextMessages =
              event.messages ??
              (agentReply ? [{ role: 'assistant', content: clean }] : [])
            if (nextMessages.length) {
              setChatHistory([...newHistory, ...nextMessages])
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
    },
    [input, isAgentRunning, chatHistory, reportState],
  )

  const handleIframeLoad = useCallback(() => {
    const sections = pendingHighlightsRef.current
    if (!sections.length) return
    const doc = iframeRef.current?.contentDocument
    if (applySectionHighlights(doc, sections)) {
      pendingHighlightsRef.current = []
    }
  }, [applySectionHighlights])

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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const styles = {
    bubble: {
      user: {
        maxWidth: '82%',
        padding: '8px 12px',
        fontSize: 13,
        lineHeight: 1.5,
        wordBreak: 'break-word',
        borderRadius: '14px 14px 3px 14px',
        background: '#2957FF',
        color: '#fff',
      },
      assistant: {
        maxWidth: '92%',
        padding: '8px 12px',
        fontSize: 13,
        lineHeight: 1.55,
        wordBreak: 'break-word',
        borderRadius: '14px 14px 14px 3px',
        background: '#f1f5f9',
        color: '#1a1a1a',
      },
    },
    dot: {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#2957FF',
      marginRight: 5,
      verticalAlign: 'middle',
      animation: 'pulse 1s infinite',
    },
    cursor: {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#2957FF',
      marginLeft: 4,
      verticalAlign: 'middle',
      animation: 'pulse 1s infinite',
    },
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid #e2e8f0',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>
          {company} — AI ROI Report
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              display: 'flex',
              gap: 2,
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('exec')}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                background: activeTab === 'exec' ? '#2957FF' : '#fff',
                color: activeTab === 'exec' ? '#fff' : '#374151',
                cursor: 'pointer',
              }}
            >
              Executive Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('full')}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                background: activeTab === 'full' ? '#2957FF' : '#fff',
                color: activeTab === 'full' ? '#fff' : '#374151',
                cursor: 'pointer',
              }}
            >
              Full Report
            </button>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            style={{
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              background: '#fff',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={emailStatus === 'sending'}
            style={{
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 500,
              border: '1px solid #2957FF',
              borderRadius: 6,
              background:
                emailStatus === 'sent'
                  ? '#dcfce7'
                  : emailStatus === 'error'
                  ? '#fee2e2'
                  : '#2957FF',
              color:
                emailStatus === 'sent'
                  ? '#166534'
                  : emailStatus === 'error'
                  ? '#991b1b'
                  : '#fff',
              cursor: emailStatus === 'sending' ? 'not-allowed' : 'pointer',
              opacity: emailStatus === 'sending' ? 0.7 : 1,
            }}
          >
            {emailStatus === 'sending'
              ? 'Sending…'
              : emailStatus === 'sent'
              ? 'Email Sent!'
              : emailStatus === 'error'
              ? 'Send Failed'
              : 'Re-send Email'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Report iframe (65% width) */}
        <div
          style={{
            flex: '0 0 65%',
            overflow: 'hidden',
            borderRight: '1px solid #e2e8f0',
            background: '#f1f5f9',
          }}
        >
          <iframe
            ref={iframeRef}
            srcDoc={activeHtml ?? ''}
            onLoad={handleIframeLoad}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="ROI Report Preview"
          />
        </div>

        {/* Chat panel */}
        <div
          style={{
            flex: '0 0 35%',
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {/* Initial assistant message — always shown as first bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={styles.bubble.assistant}>{initialMessage}</div>
            </div>

            {/* Conversation history */}
            {chatHistory.map((msg, i) => {
              if (msg.role === 'tool') return null
              const text =
                typeof msg.content === 'string'
                  ? msg.content
                  : Array.isArray(msg.content)
                  ? msg.content
                      .filter((p) => p.type === 'text')
                      .map((p) => p.text)
                      .join('')
                      .trim()
                  : ''
              if (!text) return null
              const isUser = msg.role === 'user'
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={
                      isUser ? styles.bubble.user : styles.bubble.assistant
                    }
                  >
                    {isUser ? text : renderText(text)}
                  </div>
                </div>
              )
            })}

            {/* Changed sections chips — shown after agent finishes */}
            {!isAgentRunning && lastChangedSections.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 5,
                  paddingLeft: 2,
                }}
              >
                <span
                  style={{ fontSize: 11, color: '#8a8aaa', flexShrink: 0 }}
                >
                  Sections updated:
                </span>
                {[...new Set(lastChangedSections)].map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      background: '#eef2ff',
                      color: '#2957ff',
                      border: '1px solid #c7d2fe',
                      borderRadius: 4,
                      padding: '2px 7px',
                    }}
                  >
                    {SECTION_LABELS[s] ?? s}
                  </span>
                ))}
              </div>
            )}

            {/* Agent working — tool label + streaming text in one assistant bubble */}
            {(activeTool || streamingText) && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={styles.bubble.assistant}>
                  {activeTool && !streamingText && (
                    <span
                      style={{
                        color: '#8a8aaa',
                        fontStyle: 'italic',
                        fontSize: 12,
                      }}
                    >
                      <span style={styles.dot} /> {activeTool}
                    </span>
                  )}
                  {streamingText && (
                    <>
                      {renderText(streamingText)}
                      <span style={styles.cursor} />
                    </>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px 14px 12px',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <form
              onSubmit={handleSend}
              style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to change anything in the report…"
                disabled={isAgentRunning}
                rows={2}
                style={{
                  flex: 1,
                  padding: '8px 11px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.5,
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: '#1a1a1a',
                  background: isAgentRunning ? '#f9fafb' : '#fff',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2957FF'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                }}
              />
              <button
                type="submit"
                disabled={isAgentRunning || !input.trim()}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background:
                    isAgentRunning || !input.trim() ? '#e2e8f0' : '#2957FF',
                  color: isAgentRunning || !input.trim() ? '#94a3b8' : '#fff',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor:
                    isAgentRunning || !input.trim() ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                }}
              >
                Send
              </button>
            </form>
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

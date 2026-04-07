import React, { useState, useRef, useCallback, useEffect } from 'react'
import { drainSSE } from '@/src/lib/drainSSE'
import useScrollOnNewContent from '@/src/hooks/useScrollOnNewContent'

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
  const [chatMessages, setChatMessages] = useState(() => {
    const company = initialState?.assembled?.roi_data?.company ?? 'your company'
    return [{ role: 'bot', content: `Report ready for ${company}. Ask me to make any changes — update the numbers, rewrite sections, or add more context.` }]
  })
  const [streamingText, setStreamingText] = useState('')
  const [activeTool, setActiveTool] = useState(null)
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [input, setInput] = useState('')
  const [emailStatus, setEmailStatus] = useState('idle') // 'idle' | 'sending' | 'sent' | 'error'

  const iframeRef = useRef(null)
  const chatEndRef = useRef(null)
  const scrollRef = useScrollOnNewContent(chatMessages)

  // Auto-scroll chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, streamingText])

  const renderedHtml = reportState?.renderedHtml ?? initialState?.renderedHtml
  const company = reportState?.assembled?.roi_data?.company ?? ''

  const handleSend = useCallback(async (e) => {
    e?.preventDefault()
    const msg = input.trim()
    if (!msg || isAgentRunning) return

    const newHistory = [...chatHistory, { role: 'user', content: msg }]
    setChatMessages(prev => [...prev, { role: 'user', content: msg }])
    setInput('')
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
            setChatMessages(prev => [...prev, { role: 'bot', content: agentReply }])
            setChatHistory(newHistory.concat([{ role: 'assistant', content: agentReply }]))
          }
          setStreamingText('')
          setIsAgentRunning(false)
          setActiveTool(null)
        } else if (event.type === 'error') {
          setChatMessages(prev => [...prev, { role: 'error', content: event.message }])
          setStreamingText('')
          setIsAgentRunning(false)
          setActiveTool(null)
        }
      })
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'error', content: err.message }])
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
          {/* Messages area */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '90%', padding: '8px 12px', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? '#2957FF' : msg.role === 'error' ? '#fee2e2' : '#f1f5f9',
                  color: msg.role === 'user' ? '#fff' : msg.role === 'error' ? '#991b1b' : '#1a1a1a',
                  fontSize: 13, lineHeight: 1.55,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Streaming text (currently typing) */}
            {streamingText && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{
                  maxWidth: '90%', padding: '8px 12px', borderRadius: '12px 12px 12px 2px',
                  background: '#f1f5f9', color: '#1a1a1a', fontSize: 13, lineHeight: 1.55,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {streamingText}
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: '#2957FF', borderRadius: '50%', marginLeft: 4, animation: 'pulse 1s infinite' }} />
                </div>
              </div>
            )}

            {/* Tool indicator */}
            {activeTool && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2957FF', animation: 'pulse 1s infinite' }} />
                <span style={{ fontSize: 12, color: '#5a5a6e', fontStyle: 'italic' }}>{activeTool}</span>
              </div>
            )}

            <div ref={chatEndRef} />
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

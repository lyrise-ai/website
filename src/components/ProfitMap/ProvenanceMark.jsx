import React, { useState } from 'react'

// Port of the LyRise design-system ProvenanceMark (components/roi/ProvenanceMark.jsx).
// Traceability, not warning: a number that carries assumptions gets a small
// purple mark. A value the user gave (kind="given") renders nothing.

const KINDS = {
  scraped: 'Scraped',
  benchmarked: 'Benchmarked',
  estimated: 'Estimated',
}

const EASE = 'cubic-bezier(.22,.61,.36,1)'

export default function ProvenanceMark({
  kind = 'estimated',
  variant = 'dot',
  label,
  onClick,
  style,
}) {
  const [hover, setHover] = useState(false)
  if (!kind || kind === 'given') return null
  const text = label || KINDS[kind] || kind
  const title = `${text} — includes assumptions. See which.`

  const shared = {
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: `background 200ms ${EASE}`,
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={title}
        aria-label={title}
        style={{
          ...shared,
          gap: 5,
          marginLeft: 8,
          padding: '4px 9px',
          borderRadius: 999,
          background: hover ? '#e0e0ff' : '#f0f0ff',
          color: '#4200ff',
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          ...style,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: 999,
            background: '#6666ff',
          }}
        />
        {text}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
      aria-label={title}
      style={{
        ...shared,
        marginLeft: 6,
        padding: 5,
        borderRadius: 999,
        background: hover ? '#e0e0ff' : 'transparent',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: '#6666ff',
          display: 'block',
        }}
      />
    </button>
  )
}

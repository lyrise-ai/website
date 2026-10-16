/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'
import ProvenanceMark from './ProvenanceMark'
import styles from './styles.module.css'
import {
  CLAUSES,
  CONTACT_EMAIL,
  DEPTS,
  FOOTER,
  LANES,
  MEASURES,
  NAV_LINKS,
  TONES,
} from '../../constants/profitMap'

// Profit Map landing page — implementation of the Claude Design file
// "Profit Map v36 (Lean, Joseph OS)". The design's tweak props
// (heroDevice, accentColor, showProvenance) are exposed as component props.

const LOGO = '/images/profit-map/logo-inverted.png'
const MUTED = '#8A8AA0'
const SOFT = '#C7C7D6'
const EYEBROW = '#9d9dff'

const eyebrow = (color = EYEBROW, extra) => ({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color,
  ...extra,
})

const label = (color = MUTED, extra) => ({
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color,
  ...extra,
})

const h2Style = {
  fontSize: 'clamp(1.9rem,1.4rem + 1.8vw,2.75rem)',
  fontWeight: 800,
  letterSpacing: '-0.032em',
  lineHeight: 1.06,
  margin: 0,
  color: '#fff',
  textWrap: 'balance',
}

const leadStyle = {
  fontSize: 17,
  lineHeight: 1.6,
  color: MUTED,
  margin: '20px 0 0',
  textWrap: 'pretty',
}

const container = { maxWidth: 1200, margin: '0 auto' }

// Scroll reveal: mirrors the design's IntersectionObserver + scroll sweep.
// Elements opt in with the data-reveal attribute and the .reveal class.
function useReveal(rootRef, deps) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const mark = (el) => el.setAttribute('data-in', '')
    const pending = () => root.querySelectorAll('[data-reveal]:not([data-in])')

    if (typeof IntersectionObserver === 'undefined') {
      pending().forEach(mark)
      return undefined
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            mark(e.target)
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    const sweep = () => {
      pending().forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.94) mark(el)
      })
    }

    pending().forEach((el) => io.observe(el))
    window.addEventListener('scroll', sweep, { passive: true })
    window.addEventListener('resize', sweep, { passive: true })
    window.addEventListener('hashchange', sweep)
    let raf2
    const raf = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(sweep)
    })

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', sweep)
      window.removeEventListener('resize', sweep)
      window.removeEventListener('hashchange', sweep)
      cancelAnimationFrame(raf)
      if (raf2) cancelAnimationFrame(raf2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

const revealProps = (extraClass) => ({
  'data-reveal': '',
  className: extraClass ? `${styles.reveal} ${extraClass}` : styles.reveal,
})

function CheckIcon({ size = 17, color = EYEBROW, strokeWidth = 2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: '0 0 auto', marginTop: 3 }}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function Header() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(8,8,14,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          ...container,
          padding: '0 28px',
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <a
          href="#top"
          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <img
            src={LOGO}
            alt="LyRise"
            style={{ height: 22, width: 'auto', display: 'block' }}
          />
        </a>
        <nav
          aria-label="Primary"
          className={styles.navLinks}
          style={{ display: 'flex', alignItems: 'center', gap: 28 }}
        >
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={styles.navLink}>
              {l.label}
            </a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button href="#close" variant="secondary" size="sm">
            Talk to us
          </Button>
          <Button href="#close" variant="primary" size="sm">
            Start the Profit Map
          </Button>
        </div>
      </div>
    </header>
  )
}

function HeroQuiet() {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: '0 auto',
        textAlign: 'center',
        padding: 'clamp(40px,7vw,120px) 0',
      }}
    >
      <div
        className={styles.heroItem}
        style={eyebrow(EYEBROW, { animationDelay: '0ms', marginBottom: 22 })}
      >
        Joseph · Chief AI Officer
      </div>
      <h1
        className={styles.heroItem}
        style={{
          animationDelay: '60ms',
          fontSize: 'clamp(2.2rem,1.4rem + 2.6vw,3.4rem)',
          lineHeight: 1.12,
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: 0,
          color: '#fff',
        }}
      >
        Which of your workflows should stop being human?
      </h1>
      <p
        className={styles.heroItem}
        style={{
          animationDelay: '130ms',
          fontSize: 18,
          lineHeight: 1.6,
          color: MUTED,
          margin: '24px auto 0',
          maxWidth: '58ch',
          textWrap: 'pretty',
        }}
      >
        Joseph reads how your company actually works, finds where the money
        leaks, and prices the agent that stops it.
      </p>
      <p
        className={styles.heroItem}
        style={{
          animationDelay: '190ms',
          fontSize: 18,
          lineHeight: 1.6,
          color: EYEBROW,
          fontWeight: 600,
          margin: '18px 0 0',
        }}
      >
        You see the number before you commit to anything.
      </p>
      <div
        className={styles.heroItem}
        style={{
          animationDelay: '250ms',
          marginTop: 38,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button href="#close" variant="primary" size="lg">
          Start the Profit Map — free
        </Button>
      </div>
    </div>
  )
}

function Console({ accent, dept, onPick }) {
  return (
    <div
      className={styles.heroItem}
      style={{
        animationDelay: '300ms',
        marginTop: 'clamp(44px,5vw,68px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 24,
        background: '#0D0D15',
        overflow: 'hidden',
        boxShadow: '0 60px 120px -50px rgba(0,0,34,0.95)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '12px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              background: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            J
          </span>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              color: SOFT,
              letterSpacing: '-0.15px',
            }}
          >
            joseph — console
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#4fd6cf',
              background: 'rgba(0,184,176,0.12)',
              padding: '4px 10px',
              borderRadius: 999,
            }}
          >
            3 agents live
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#b6b6ff',
              background: 'rgba(102,102,255,0.14)',
              padding: '4px 10px',
              borderRadius: 999,
            }}
          >
            You&apos;re in control
          </span>
        </div>
      </div>

      <div
        className={styles.console}
        style={{ display: 'grid', gridTemplateColumns: '216px 1fr' }}
      >
        <aside
          style={{
            borderRight: '1px solid rgba(255,255,255,0.07)',
            padding: '16px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'rgba(255,255,255,0.015)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 11px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={MUTED}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flex: '0 0 auto' }}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span style={{ fontSize: 12, color: MUTED }}>Search workflows</span>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: MUTED,
                padding: '0 4px 8px',
              }}
            >
              Departments
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {DEPTS.map((x) => {
                const on = x.key === dept.key
                return (
                  <button
                    key={x.key}
                    type="button"
                    className={styles.deptButton}
                    onClick={() => onPick(x.key)}
                    aria-pressed={on}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      width: '100%',
                      textAlign: 'left',
                      border: 0,
                      cursor: 'pointer',
                      padding: '9px 11px',
                      borderRadius: 10,
                      fontFamily: 'inherit',
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: '-0.15px',
                      background: on ? 'rgba(102,102,255,0.18)' : 'transparent',
                      color: on ? '#ffffff' : MUTED,
                    }}
                  >
                    <span>{x.label}</span>
                    <span
                      style={{ fontSize: 11, color: on ? '#b6b6ff' : MUTED }}
                    >
                      {x.n}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 14,
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: 'linear-gradient(140deg,#6666ff,#4200FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              J
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 1.3,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
                Joseph
              </span>
              <span style={{ fontSize: 11.5, color: MUTED }}>
                Chief AI Officer
              </span>
            </span>
          </div>
        </aside>

        <div style={{ minWidth: 0 }}>
          <div
            key={dept.key}
            style={{
              padding: '18px 20px 12px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '-0.2px',
                }}
              >
                {dept.label}
              </div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>
                {dept.meta}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.10)',
                fontSize: 11.5,
                color: MUTED,
              }}
            >
              <span
                className={styles.pulseFast}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: '#00b8b0',
                }}
              />
              reading live
            </div>
          </div>
          <div key={`rows-${dept.key}`} style={{ padding: '0 12px 14px' }}>
            {dept.rows.map((r, i) => (
              <div
                key={r.name}
                className={styles.row}
                style={{
                  animationDelay: `${i * 70}ms`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 12px',
                  borderRadius: 10,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span
                  style={{
                    flex: '0 0 auto',
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    color: EYEBROW,
                    letterSpacing: '0.02em',
                  }}
                >
                  {r.initial}
                </span>
                <span
                  style={{
                    flex: '0 0 auto',
                    minWidth: 0,
                    width: 132,
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#fff',
                    letterSpacing: '-0.15px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.name}
                </span>
                <span
                  style={{
                    flex: '1 1 auto',
                    minWidth: 0,
                    fontSize: 13,
                    color: MUTED,
                    letterSpacing: '-0.15px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.status}
                </span>
                <span style={{ flex: '0 0 auto', fontSize: 11, color: MUTED }}>
                  {r.time}
                </span>
                <span
                  style={{
                    flex: '0 0 auto',
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: 999,
                    background: TONES[r.tone].bg,
                    color: TONES[r.tone].fg,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.state}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroConsole({ accent, dept, onPick }) {
  return (
    <div>
      <div
        className={styles.heroItem}
        style={{
          animationDelay: '0ms',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 30,
        }}
      >
        <a
          href="#agents"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 8px 6px 14px',
            borderRadius: 999,
            border: '1px solid rgba(102,102,255,0.35)',
            background: 'rgba(102,102,255,0.10)',
            fontSize: 12.5,
            fontWeight: 500,
            color: SOFT,
          }}
        >
          <span
            className={styles.pulse}
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: '#00b8b0',
            }}
          />
          <span>Joseph now prices the agent before you commit</span>
          <span style={{ color: EYEBROW, fontWeight: 600, paddingRight: 8 }}>
            →
          </span>
        </a>
      </div>
      <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <h1
          className={styles.heroItem}
          style={{
            animationDelay: '60ms',
            fontSize: 'clamp(2.4rem,1.3rem + 3.4vw,4.25rem)',
            lineHeight: 1.02,
            fontWeight: 800,
            letterSpacing: '-0.035em',
            margin: 0,
            color: '#fff',
          }}
        >
          Your Chief AI Officer.
        </h1>
        <p
          className={styles.heroItem}
          style={{
            animationDelay: '130ms',
            fontSize: 18,
            lineHeight: 1.62,
            color: MUTED,
            margin: '22px auto 0',
            maxWidth: '56ch',
            textWrap: 'pretty',
          }}
        >
          Joseph reads how your company works, finds where the money leaks, and
          prices the agent that stops it — before you commit to anything.
        </p>
        <div
          className={styles.heroItem}
          style={{
            animationDelay: '200ms',
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginTop: 34,
          }}
        >
          <Button href="#close" variant="primary" size="lg">
            Start the Profit Map — free
          </Button>
          <Button href="#sequence" variant="secondary" size="lg">
            See how it works
          </Button>
        </div>
      </div>
      <Console accent={accent} dept={dept} onPick={onPick} />
    </div>
  )
}

function Hero({ heroDevice, accent, dept, onPick }) {
  return (
    <section
      id="top"
      style={{
        position: 'relative',
        padding: 'clamp(56px,7vw,104px) 28px clamp(64px,7vw,96px)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(900px 520px at 18% -10%, rgba(102,102,255,0.20), transparent 65%), radial-gradient(700px 460px at 92% 8%, rgba(0,184,176,0.10), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', ...container }}>
        {heroDevice === 'quiet' ? (
          <HeroQuiet />
        ) : (
          <HeroConsole accent={accent} dept={dept} onPick={onPick} />
        )}
      </div>
    </section>
  )
}

function ThesisBand() {
  return (
    <div
      style={{
        background: 'rgba(102,102,255,0.07)',
        borderTop: '1px solid rgba(102,102,255,0.16)',
        borderBottom: '1px solid rgba(102,102,255,0.16)',
      }}
    >
      <div style={{ ...container, padding: '19px 28px', textAlign: 'center' }}>
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(0.95rem,0.9rem + 0.35vw,1.125rem)',
            fontWeight: 600,
            color: SOFT,
            letterSpacing: '-0.01em',
          }}
        >
          Nobody needs more AI. They need to know which work should stop being
          human.
        </p>
      </div>
    </div>
  )
}

function Sequence() {
  return (
    <section id="sequence" style={{ padding: 'clamp(80px,9vw,124px) 28px' }}>
      <div style={container}>
        <div
          {...revealProps()}
          style={{ maxWidth: '54ch', marginBottom: 'clamp(40px,4vw,60px)' }}
        >
          <div style={eyebrow(EYEBROW, { marginBottom: 16 })}>
            How it works, end to end
          </div>
          <h2 style={h2Style}>
            Three layers. Five steps. Every one priced up front.
          </h2>
          <p style={leadStyle}>
            You can stop after any layer and keep what you paid for. Most
            companies map first and decide later.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {LANES.map((l) => (
            <div
              key={l.label}
              {...revealProps(styles.lane)}
              style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                gap: 16,
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 24,
                background: 'rgba(255,255,255,0.022)',
                padding: 16,
                alignItems: 'stretch',
              }}
            >
              <div
                className={styles.laneLabel}
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: EYEBROW,
                  background: 'rgba(102,102,255,0.08)',
                  border: '1px solid rgba(102,102,255,0.20)',
                  borderRadius: 16,
                  padding: '14px 0',
                }}
              >
                {l.label}
              </div>
              <div
                className={styles.twoCol}
                style={{
                  display: 'grid',
                  gridTemplateColumns: l.cols,
                  gap: 14,
                }}
              >
                {l.steps.map((s) => (
                  <div
                    key={s.num}
                    style={{
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 16,
                      background: '#0D0D15',
                      padding: '24px 24px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      minHeight: l.h,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          color: MUTED,
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: '#b6b6ff',
                          background: 'rgba(102,102,255,0.14)',
                          padding: '4px 11px',
                          borderRadius: 999,
                        }}
                      >
                        {s.price}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: 'clamp(1.15rem,1rem + 0.5vw,1.4rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.022em',
                        lineHeight: 1.18,
                        margin: 0,
                        color: '#fff',
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14.5,
                        lineHeight: 1.58,
                        color: MUTED,
                        margin: 0,
                        textWrap: 'pretty',
                      }}
                    >
                      {s.body}
                    </p>
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: 14,
                        borderTop: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        fontSize: 12.5,
                      }}
                    >
                      <span style={{ color: MUTED }}>{s.duration}</span>
                      <span style={{ color: SOFT, fontWeight: 500 }}>
                        {s.owner}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Agents({ accent, dept, onPick, showProvenance }) {
  return (
    <section
      id="agents"
      style={{
        padding: 'clamp(88px,10vw,140px) 28px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: '#0A0A11',
      }}
    >
      <div style={container}>
        <div {...revealProps()} style={{ maxWidth: '52ch', marginBottom: 36 }}>
          <div style={eyebrow(EYEBROW, { marginBottom: 16 })}>The roster</div>
          <h2 style={h2Style}>
            You are not buying software. You are filling a role.
          </h2>
          <p style={leadStyle}>
            So we write it up the way you would write a job. What it does, what
            it costs, and where it stops.
          </p>
        </div>

        <div
          {...revealProps()}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 9,
            marginBottom: 26,
          }}
        >
          {DEPTS.map((x) => {
            const on = x.key === dept.key
            return (
              <button
                key={x.key}
                type="button"
                className={styles.chip}
                onClick={() => onPick(x.key)}
                aria-pressed={on}
                style={{
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 13.5,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  padding: '10px 20px',
                  borderRadius: 999,
                  background: on ? accent : 'rgba(255,255,255,0.03)',
                  color: on ? '#ffffff' : SOFT,
                  border: `1px solid ${on ? accent : 'rgba(255,255,255,0.14)'}`,
                }}
              >
                {x.chip}
              </button>
            )
          })}
        </div>

        <div
          key={dept.key}
          {...revealProps()}
          style={{
            border: '1px solid rgba(255,255,255,0.11)',
            borderRadius: 32,
            background: '#0D0D15',
            overflow: 'hidden',
          }}
        >
          <div
            className={styles.twoCol}
            style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr' }}
          >
            <div
              style={{
                padding: 'clamp(30px,3.4vw,46px)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginBottom: 20,
                }}
              >
                <span style={label(EYEBROW)}>{dept.label}</span>
                <span
                  style={{
                    width: 1,
                    height: 12,
                    background: 'rgba(255,255,255,0.16)',
                  }}
                />
                <span style={{ fontSize: 12, color: MUTED }}>
                  Works 24/7 · reports to you
                </span>
              </div>
              <h3
                style={{
                  fontSize: 'clamp(1.5rem,1.2rem + 1.1vw,2.1rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.028em',
                  lineHeight: 1.1,
                  margin: 0,
                  color: '#fff',
                }}
              >
                {dept.agent}
              </h3>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.62,
                  color: MUTED,
                  margin: '16px 0 0',
                  maxWidth: '52ch',
                  textWrap: 'pretty',
                }}
              >
                {dept.summary}
              </p>

              <div style={{ marginTop: 30 }}>
                <div style={label(MUTED, { marginBottom: 14 })}>
                  Core responsibilities
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {dept.skills.map((s) => (
                    <div
                      key={s}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 11,
                      }}
                    >
                      <CheckIcon />
                      <span
                        style={{ fontSize: 15, lineHeight: 1.55, color: SOFT }}
                      >
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: 30,
                  padding: '20px 22px',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.025)',
                }}
              >
                <div style={label(MUTED, { marginBottom: 12 })}>
                  Where it runs
                </div>
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    color: MUTED,
                    margin: 0,
                  }}
                >
                  {dept.scope}
                </p>
              </div>
            </div>

            <div
              style={{
                padding: 'clamp(30px,3.4vw,46px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 26,
              }}
            >
              <div>
                <div style={label(MUTED, { marginBottom: 12 })}>
                  Compensation
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(2rem,1.6rem + 1.4vw,2.8rem)',
                      fontWeight: 800,
                      letterSpacing: '-0.035em',
                      color: '#fff',
                      lineHeight: 1,
                    }}
                  >
                    {dept.price}
                  </span>
                  <span style={{ fontSize: 14, color: MUTED }}>/ month</span>
                </div>
                <p
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.6,
                    color: MUTED,
                    margin: '12px 0 0',
                  }}
                >
                  Priced after the process map. Across all departments agents
                  run from $200 to $10,000 a month, set by how complex the
                  workflow is.
                </p>
              </div>

              <div
                style={{
                  padding: '22px 24px',
                  borderRadius: 16,
                  border: '1px solid rgba(0,184,176,0.28)',
                  background: 'rgba(0,184,176,0.07)',
                }}
              >
                <div style={label('#4fd6cf', { marginBottom: 10 })}>
                  What it gives back
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    color: '#fff',
                    lineHeight: 1.2,
                  }}
                >
                  {dept.saving}
                </div>
                {showProvenance && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 9,
                      marginTop: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <ProvenanceMark
                      kind="estimated"
                      variant="pill"
                      style={{ marginLeft: 0 }}
                    />
                    <span style={{ fontSize: 12, color: MUTED }}>
                      modelled from comparable maps
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div style={label('#f08e94', { marginBottom: 14 })}>
                  Stays human
                </div>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {dept.human.map((h) => (
                    <div
                      key={h}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 11,
                      }}
                    >
                      <span
                        style={{
                          flex: '0 0 auto',
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          border: '1.5px solid rgba(240,142,148,0.55)',
                          marginTop: 3,
                        }}
                      />
                      <span
                        style={{ fontSize: 15, lineHeight: 1.55, color: SOFT }}
                      >
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex' }}>
                <Button href="#close" variant="primary" size="md" fullWidth>
                  Map this department — free
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div
          {...revealProps()}
          style={{
            marginTop: 16,
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 24,
            background: 'rgba(255,255,255,0.022)',
            padding: 'clamp(26px,3vw,36px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ maxWidth: '60ch' }}>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: '-0.022em',
                margin: 0,
                color: '#fff',
              }}
            >
              Your bottleneck isn&apos;t on that list?
            </h3>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: MUTED,
                margin: '10px 0 0',
                textWrap: 'pretty',
              }}
            >
              Most of the maps we build are for work that has no department name
              — the handover nobody owns. That is usually where the money is.
            </p>
          </div>
          <Button href="#close" variant="secondary" size="md">
            Describe it to Joseph →
          </Button>
        </div>
      </div>
    </section>
  )
}

function Landmark() {
  return (
    <section
      id="landmark"
      style={{
        padding: 'clamp(96px,11vw,152px) 28px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div style={container}>
        <div
          className={styles.twoCol}
          style={{
            display: 'grid',
            gridTemplateColumns: '0.95fr 1.05fr',
            gap: 'clamp(36px,5vw,72px)',
            alignItems: 'start',
          }}
        >
          <div {...revealProps()}>
            <div style={eyebrow(EYEBROW, { marginBottom: 16 })}>
              The Landmark
            </div>
            <h2 style={h2Style}>
              Before an agent goes live, we sign what stays human.
            </h2>
            <p style={{ ...leadStyle, lineHeight: 1.62 }}>
              Most vendors sell throughput. We measure three things instead, and
              we put the third one in writing. One afternoon, one page, signed
              by you and by us.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginTop: 32,
              }}
            >
              {MEASURES.map((m) => (
                <div
                  key={m.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    gap: 18,
                    alignItems: 'baseline',
                    padding: '18px 0',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={label(EYEBROW, { width: 96 })}>{m.label}</span>
                  <span
                    style={{ fontSize: 15.5, lineHeight: 1.58, color: SOFT }}
                  >
                    {m.body}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            {...revealProps()}
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 24,
              background: '#0D0D15',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '22px 28px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: SOFT,
                }}
              >
                The Landmark, one page
              </span>
              <span style={{ fontSize: 11.5, color: MUTED }}>
                Signed before build starts
              </span>
            </div>
            <div style={{ padding: '8px 28px 28px' }}>
              {CLAUSES.map((c) => (
                <div
                  key={c.num}
                  style={{
                    padding: '22px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 9,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        color: MUTED,
                      }}
                    >
                      {c.num}
                    </span>
                    <span
                      style={{
                        fontSize: 15.5,
                        fontWeight: 700,
                        letterSpacing: '-0.018em',
                        color: '#fff',
                      }}
                    >
                      {c.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: MUTED,
                      margin: 0,
                      textWrap: 'pretty',
                    }}
                  >
                    {c.body}
                  </p>
                </div>
              ))}
              <div
                className={styles.twoCol}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                  marginTop: 30,
                }}
              >
                <div>
                  <div
                    style={{
                      height: 34,
                      borderBottom: '1px solid rgba(255,255,255,0.22)',
                    }}
                  />
                  <div style={{ fontSize: 11.5, color: MUTED, marginTop: 9 }}>
                    For your company
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: 34,
                      borderBottom: '1px solid rgba(255,255,255,0.22)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      paddingBottom: 4,
                    }}
                  >
                    <img
                      src={LOGO}
                      alt="LyRise"
                      style={{ height: 15, width: 'auto', opacity: 0.85 }}
                    />
                  </div>
                  <div style={{ fontSize: 11.5, color: MUTED, marginTop: 9 }}>
                    For LyRise
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Guarantee() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background:
          'radial-gradient(1200px 640px at 50% 120%, #1b1b4d, #000022 70%)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(520px 380px at 15% 20%, rgba(102,102,255,0.28), transparent 65%), radial-gradient(460px 340px at 85% 30%, rgba(0,184,176,0.16), transparent 68%), radial-gradient(400px 300px at 60% 95%, rgba(193,150,197,0.16), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        {...revealProps()}
        style={{
          position: 'relative',
          maxWidth: 900,
          margin: '0 auto',
          padding: 'clamp(100px,12vw,160px) 28px',
          textAlign: 'center',
        }}
      >
        <div style={eyebrow('#b6b6ff', { marginBottom: 24 })}>
          Our guarantee
        </div>
        <p
          style={{
            fontSize: 'clamp(1.5rem,1.1rem + 1.8vw,2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.18,
            color: '#fff',
            margin: 0,
            textWrap: 'balance',
          }}
        >
          “If we can&apos;t show you how to make $30K/month or 3x your current
          profits, we won&apos;t work with you.”
        </p>
        <p
          style={{
            fontSize: 16.5,
            lineHeight: 1.6,
            color: SOFT,
            margin: '26px auto 0',
            maxWidth: '50ch',
          }}
        >
          The map is free and yours either way. If the number isn&apos;t there,
          we say so and we stop.
        </p>
      </div>
    </section>
  )
}

function Close() {
  const card = {
    borderRadius: 32,
    padding: 'clamp(34px,4vw,52px)',
    display: 'flex',
    flexDirection: 'column',
  }
  const cardH2 = {
    fontSize: 'clamp(1.6rem,1.3rem + 1.2vw,2.3rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.08,
    margin: 0,
    color: '#fff',
    textWrap: 'balance',
  }
  const cardP = {
    fontSize: 16,
    lineHeight: 1.62,
    margin: '16px 0 0',
    maxWidth: '40ch',
    textWrap: 'pretty',
  }
  return (
    <section id="close" style={{ padding: 'clamp(104px,12vw,168px) 28px' }}>
      <div style={container}>
        <div
          className={styles.close}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          <div
            {...revealProps()}
            style={{
              ...card,
              border: '1px solid rgba(102,102,255,0.30)',
              background:
                'linear-gradient(160deg, rgba(102,102,255,0.14), rgba(102,102,255,0.04))',
            }}
          >
            <div style={label('#b6b6ff', { marginBottom: 18 })}>
              If you&apos;re ready
            </div>
            <h2 style={cardH2}>Start the Profit Map.</h2>
            <p style={{ ...cardP, color: SOFT }}>
              Twenty minutes with Joseph. You leave with the workflow that maps
              first, the agent that would run it, and what it costs.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 34 }}>
              <Button
                href={`mailto:${CONTACT_EMAIL}?subject=Profit%20Map`}
                variant="primary"
                size="lg"
              >
                Start the map — free
              </Button>
            </div>
          </div>
          <div
            {...revealProps()}
            style={{
              ...card,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'rgba(255,255,255,0.025)',
            }}
          >
            <div style={label(MUTED, { marginBottom: 18 })}>
              If you&apos;re not
            </div>
            <h2 style={cardH2}>Take the numbers without the meeting.</h2>
            <p style={{ ...cardP, color: MUTED }}>
              One page: what each agent does, what it costs a month, and where
              it stops. Read it, decide later, no follow-up.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: 34 }}>
              <Button
                href={`mailto:${CONTACT_EMAIL}?subject=Cost%20sheet`}
                variant="secondary"
                size="lg"
              >
                Get the cost sheet →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: '#06060B',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 28px 0' }}>
        <div
          className={styles.footCols}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: '40px 24px',
          }}
        >
          {FOOTER.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: SOFT,
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 11 }}
              >
                {col.links.map((lk) => (
                  <a key={lk} href="#top" className={styles.footerLink}>
                    {lk}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
            marginTop: 56,
            padding: '20px 0',
            borderTop: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span style={{ fontSize: 11, color: MUTED }}>
            © 2026 LyRise. All rights reserved.
          </span>
          <span style={{ fontSize: 11, color: MUTED }}>
            {CONTACT_EMAIL} · lyrise.ai
          </span>
        </div>
        <div style={{ padding: '8px 0 40px' }}>
          <img
            src={LOGO}
            alt=""
            aria-hidden="true"
            style={{
              width: '100%',
              maxWidth: 1224,
              height: 'auto',
              display: 'block',
              opacity: 0.1,
            }}
          />
        </div>
      </div>
    </footer>
  )
}

export default function ProfitMapPage({
  heroDevice = 'console',
  accentColor = '#6666ff',
  showProvenance = true,
}) {
  const [deptKey, setDeptKey] = useState('finance')
  const rootRef = useRef(null)
  const dept = DEPTS.find((x) => x.key === deptKey) || DEPTS[0]

  useReveal(rootRef, [deptKey])

  return (
    <div ref={rootRef} className={styles.page}>
      <Header />
      <main>
        <Hero
          heroDevice={heroDevice}
          accent={accentColor}
          dept={dept}
          onPick={setDeptKey}
        />
        <ThesisBand />
        <Sequence />
        <Agents
          accent={accentColor}
          dept={dept}
          onPick={setDeptKey}
          showProvenance={showProvenance}
        />
        <Landmark />
        <Guarantee />
        <Close />
      </main>
      <Footer />
    </div>
  )
}

import React, { useState, useRef } from 'react'
import styles from './AgentConstructionBand.module.css'

/**
 * InteractiveAgentBot - 2D Interactive AI Builder Robot
 *
 * Vector AI agent with autonomous block-building loop and full mouse interactivity:
 * - Hover detection & cursor-following pupils
 * - Floating status pill
 * - Click bounce & extensible interaction hooks
 *
 * @param {Object} props
 * @param {'left' | 'right'} props.side - 'left' faces towards left wall; 'right' faces towards right wall
 * @param {string} props.botId - Unique identifier
 * @param {string} props.statusLabel - Text shown in hover bubble
 * @param {Function} props.onInteract - Interaction callback: (type, payload) => void
 */
export default function InteractiveAgentBot({
  side = 'left',
  botId = 'agent-alpha',
  statusLabel = 'Agent #01 // Intake Active',
  onInteract,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })
  const botRef = useRef(null)

  const isLeft = side === 'left'

  // Cursor tracking for pupils
  const handleMouseMove = (e) => {
    if (!botRef.current) return
    const rect = botRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const dx = Math.max(-2.5, Math.min(2.5, (e.clientX - centerX) / 10))
    const dy = Math.max(-2, Math.min(2, (e.clientY - centerY) / 8))

    setPupilOffset({ x: dx, y: dy })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (onInteract) onInteract('hover', { botId, side })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPupilOffset({ x: 0, y: 0 })
    if (onInteract) onInteract('leave', { botId, side })
  }

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 550)
    if (onInteract) onInteract('click', { botId, side })
  }

  // Target coordinates for lifting the block into the stepped wall
  // For left side, wall is towards the left (-X direction)
  // For right side, wall is towards the right (+X direction)
  const targetX = isLeft ? '-44px' : '44px'
  const targetY = '-48px'

  return (
    <div
      ref={botRef}
      className={styles.robotWrapper}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        '--target-x': targetX,
        '--target-y': targetY,
      }}
      role="button"
      tabIndex={0}
      aria-label={`AI Builder ${statusLabel}`}
    >
      {/* Interactive Status Bubble */}
      <div
        className={`${styles.statusBubble} ${
          isHovered ? styles.statusBubbleVisible : ''
        }`}
      >
        <span className={styles.bubbleDot} />
        {statusLabel}
      </div>

      <svg
        width="92"
        height="114"
        viewBox="0 0 92 114"
        className={styles.robotSvg}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: isLeft ? 'none' : 'scaleX(-1)', // Mirrored orientation
        }}
      >
        <defs>
          <linearGradient
            id={`botChassis_${botId}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eaf0f8" />
          </linearGradient>

          <linearGradient
            id={`visorDark_${botId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1a1c2e" />
            <stop offset="100%" stopColor="#0a0b16" />
          </linearGradient>

          <linearGradient
            id={`coreGradient_${botId}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6666ff" />
            <stop offset="100%" stopColor="#00b8b0" />
          </linearGradient>
        </defs>

        {/* Soft Ground Shadow */}
        <ellipse
          cx="46"
          cy="102"
          rx="22"
          ry="4.5"
          fill="rgba(0, 0, 34, 0.09)"
        />

        {/* Main Robot Body Group */}
        <g
          className={styles.robotBodyGroup}
          style={{
            transform: isClicked ? 'translateY(-9px) scale(1.07)' : undefined,
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Antenna */}
          <line
            x1="46"
            y1="28"
            x2="46"
            y2="16"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="46"
            cy="13"
            r="4.5"
            className={styles.antennaGlow}
            fill={isHovered ? '#00b8b0' : '#6666ff'}
          />

          {/* Ear Sensor Nodes */}
          <rect x="23" y="37" width="4.5" height="13" rx="2" fill="#475569" />
          <rect x="64.5" y="37" width="4.5" height="13" rx="2" fill="#475569" />

          {/* Head */}
          <rect
            x="26.5"
            y="26"
            width="39"
            height="32"
            rx="9"
            fill={`url(#botChassis_${botId})`}
            stroke="rgba(0, 0, 34, 0.22)"
            strokeWidth="1.75"
          />

          {/* Visor Screen */}
          <rect
            x="31"
            y="32"
            width="30"
            height="18"
            rx="5.5"
            fill={`url(#visorDark_${botId})`}
          />

          {/* Pupil Eyes (Cursor Tracking) */}
          <g
            className={styles.pupilGroup}
            style={{
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
            }}
          >
            {isHovered ? (
              // Cheerful Curved Happy Eyes on Hover
              <>
                <path
                  d="M 36 41.5 Q 39.5 37 43 41.5"
                  stroke="#00b8b0"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M 49 41.5 Q 52.5 37 56 41.5"
                  stroke="#00b8b0"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              // Standard Focused Glowing Cyan Pupils
              <>
                <circle cx="39.5" cy="41" r="3" fill="#00b8b0" />
                <circle cx="52.5" cy="41" r="3" fill="#00b8b0" />
                <circle cx="40.5" cy="40" r="1" fill="#ffffff" />
                <circle cx="53.5" cy="40" r="1" fill="#ffffff" />
              </>
            )}
          </g>

          {/* Neck Joint */}
          <rect x="42" y="58" width="8" height="4" rx="1.5" fill="#64748b" />

          {/* Torso / Chassis */}
          <rect
            x="29"
            y="62"
            width="34"
            height="27"
            rx="7"
            fill={`url(#botChassis_${botId})`}
            stroke="rgba(0, 0, 34, 0.22)"
            strokeWidth="1.75"
          />

          {/* Power Core Badge */}
          <circle
            cx="46"
            cy="73"
            r="5.5"
            fill={`url(#coreGradient_${botId})`}
            filter="drop-shadow(0 0 4px rgba(102, 102, 255, 0.45))"
          />
          <circle cx="46" cy="73" r="2.2" fill="#ffffff" />

          {/* Belt Trim */}
          <line
            x1="33"
            y1="82"
            x2="59"
            y2="82"
            stroke="rgba(0, 0, 34, 0.18)"
            strokeWidth="1.5"
          />

          {/* Feet */}
          <rect x="34" y="89" width="9" height="7" rx="3.5" fill="#475569" />
          <rect x="49" y="89" width="9" height="7" rx="3.5" fill="#475569" />

          {/* Arms */}
          <rect
            x="22"
            y="64"
            width="6.5"
            height="16"
            rx="3"
            fill="#cbd5e1"
            stroke="rgba(0, 0, 34, 0.15)"
            strokeWidth="1"
          />
          <circle cx="25.2" cy="82" r="3.5" fill="#475569" />

          <rect
            x="63.5"
            y="64"
            width="6.5"
            height="16"
            rx="3"
            fill="#cbd5e1"
            stroke="rgba(0, 0, 34, 0.15)"
            strokeWidth="1"
          />
          <circle cx="66.7" cy="82" r="3.5" fill="#475569" />
        </g>

        {/* The Carried 2D Block (Autonomous Lifting Loop) */}
        <g className={styles.liftedBlock}>
          {/* Tractor Beams from Hands */}
          <line
            x1="25"
            y1="82"
            x2="46"
            y2="88"
            stroke="rgba(102, 102, 255, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <line
            x1="67"
            y1="82"
            x2="46"
            y2="88"
            stroke="rgba(0, 184, 176, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Flat 2D Block */}
          <g transform="translate(34, 78)">
            <rect
              x="0"
              y="0"
              width="24"
              height="20"
              rx="4"
              fill="#ffffff"
              stroke="#6666ff"
              strokeWidth="1.75"
            />
            <line
              x1="2"
              y1="2"
              x2="22"
              y2="2"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <circle cx="12" cy="10" r="2.2" fill="#00b8b0" />
          </g>
        </g>
      </svg>
    </div>
  )
}

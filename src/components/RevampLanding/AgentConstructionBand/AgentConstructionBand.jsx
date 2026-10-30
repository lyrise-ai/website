import React from 'react'
import styles from './AgentConstructionBand.module.css'
import FlatSteppedBlocks from './FlatSteppedBlocks'
import InteractiveAgentBot from './InteractiveAgentBot'

/**
 * AgentConstructionBand - Dedicated Full-Width 2D Agent Construction Section
 *
 * Sits directly beneath HeroSection, framing the entire screen width with:
 * - High-contrast flat 2D stepped modular blocks at the far-left and far-right
 * - Autonomous 2D robotic agents actively lifting and placing blocks
 * - Built-in cursor tracking, hover status bubble, and click interactions
 * - Minimal architectural horizon line spanning the center
 *
 * @param {Object} props
 * @param {Function} props.onAgentInteract - Optional interaction callback
 */
export default function AgentConstructionBand({ onAgentInteract }) {
  return (
    <section
      className={styles.constructionSection}
      aria-label="Autonomous Agent Builders"
    >
      {/* Full-Width Architectural Horizon Baseline */}
      <div className={styles.horizonContainer}>
        <div className={styles.horizonLineLeft} />
        <div className={styles.horizonBadge}>
          <span className={styles.pulseIndicator} />
          <span>Autonomous Operations Infrastructure</span>
        </div>
        <div className={styles.horizonLineRight} />
      </div>

      {/* Far-Left Screen Anchor: Blocks + Agent Alpha */}
      <div className={styles.leftAnchor}>
        <FlatSteppedBlocks side="left" blockSize={36} />
        <InteractiveAgentBot
          side="left"
          botId="agent-alpha"
          statusLabel="Agent Alpha // Intake Active"
          onInteract={onAgentInteract}
        />
      </div>

      {/* Far-Right Screen Anchor: Agent Beta + Blocks */}
      <div className={styles.rightAnchor}>
        <InteractiveAgentBot
          side="right"
          botId="agent-beta"
          statusLabel="Agent Beta // Yield Lock Active"
          onInteract={onAgentInteract}
        />
        <FlatSteppedBlocks side="right" blockSize={36} />
      </div>
    </section>
  )
}

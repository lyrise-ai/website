import React, { useState, useEffect, useRef } from 'react'

/**
 * SimulationCornerBuilder
 *
 * High-Fidelity Autonomous Construction Robot Simulation:
 * - Truly animated articulated robotic arms with mechanical gripping claws
 * - Reactive head tilt, expressive visors, breathing idle bob, and jump reactions
 * - Physically flying carried block with tractor guidance beam
 * - Placement flash, snap ripple, and sleep mode ("Z z z")
 * - Endless gravity decay and alert wake-up loop
 * - Tooltip positioned to the outer screen edge with high z-index (never hidden under buttons)
 */
export default function SimulationCornerBuilder({
  side = 'left',
  botId = 'agent-alpha',
  botName = 'Agent Alpha',
  blockSize = 48,
  onInteract,
}) {
  const isLeft = side === 'left'
  const gap = 5

  // 5 stepped columns: outer edge is 6 high, stepping down to 2 towards center
  const columnCapacities = isLeft ? [6, 5, 4, 3, 2] : [2, 3, 4, 5, 6]
  const totalCols = columnCapacities.length
  const maxRows = 6
  const totalCapacity = 20

  // Dimensions
  const totalWidth = totalCols * (blockSize + gap) + 16
  const totalHeight = maxRows * (blockSize + gap) + 24

  // Initial structure: Staggered initial counts so both towers start with different profiles
  const initialBlocks = isLeft
    ? [
        { id: 'b-0-0', col: 0, row: 0, isAccent: false },
        { id: 'b-1-0', col: 1, row: 0, isAccent: false },
        { id: 'b-2-0', col: 2, row: 0, isAccent: true },
        { id: 'b-0-1', col: 0, row: 1, isAccent: false },
      ]
    : [
        { id: 'b-4-0', col: 4, row: 0, isAccent: false },
        { id: 'b-3-0', col: 3, row: 0, isAccent: false },
        { id: 'b-2-0', col: 2, row: 0, isAccent: true },
        { id: 'b-1-0', col: 1, row: 0, isAccent: false },
        { id: 'b-0-0', col: 0, row: 0, isAccent: false },
        { id: 'b-4-1', col: 4, row: 1, isAccent: false },
        { id: 'b-3-1', col: 3, row: 1, isAccent: true },
      ]

  const [blocks, setBlocks] = useState(initialBlocks)
  // Phases: 'FETCHING' | 'LIFTING' | 'PLACING' | 'SNAP' | 'SLEEPING' | 'WAKING'
  const [robotPhase, setRobotPhase] = useState('FETCHING')
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })
  const [targetSlot, setTargetSlot] = useState(null)
  const [flyingBlock, setFlyingBlock] = useState(null)
  const [fallingBlockId, setFallingBlockId] = useState(null)
  const [snappedBlockId, setSnappedBlockId] = useState(null)

  const botRef = useRef(null)
  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Find lowest available slot
  const findNextSlot = (currentBlocks) => {
    const colOrder = isLeft ? [0, 1, 2, 3, 4] : [4, 3, 2, 1, 0]
    for (let r = 0; r < maxRows; r += 1) {
      for (let i = 0; i < colOrder.length; i += 1) {
        const c = colOrder[i]
        if (r < columnCapacities[c]) {
          const exists = currentBlocks.some((b) => b.col === c && b.row === r)
          if (!exists) {
            return { col: c, row: r }
          }
        }
      }
    }
    return null
  }

  // --- Autonomous Async Construction Engine (Randomized Speeds per Bot & Step) ---
  useEffect(() => {
    let isMounted = true

    async function runEngine() {
      // Stagger initial start times so bots don't sync up on page load
      const initialDelay = isLeft
        ? 150 + Math.random() * 300
        : 800 + Math.random() * 600
      await sleep(initialDelay)

      while (isMounted) {
        const cur = blocksRef.current
        const next = findNextSlot(cur)

        // 1. Structure is 100% complete -> Enter Sleep Mode
        if (!next) {
          setTargetSlot(null)
          setFlyingBlock(null)
          setRobotPhase('SLEEPING')
          while (isMounted && !findNextSlot(blocksRef.current)) {
            await sleep(500 + Math.random() * 300)
          }
          if (isMounted) {
            // Alert wake-up reaction with random startle duration
            setRobotPhase('WAKING')
            await sleep(600 + Math.random() * 400)
          }
        } else {
          // Randomize timing parameters dynamically for this individual block:
          // Each bot has independent speed variations so they never mirror each other
          const fetchTime = isLeft
            ? 550 + Math.random() * 380
            : 700 + Math.random() * 450
          const liftTime = 600 + Math.random() * 350
          const placeTime = isLeft
            ? 700 + Math.random() * 400
            : 850 + Math.random() * 450
          const snapTime = 380 + Math.random() * 250
          const interBlockPause = 150 + Math.random() * 550

          // 2. FETCHING: Target slot lights up, robot aims beam down
          setTargetSlot(next)
          setFlyingBlock(null)
          setRobotPhase('FETCHING')
          await sleep(fetchTime)
          if (!isMounted) break

          // 3. LIFTING: Carried block hovers in robot's tractor beam
          const isAccent = Math.random() < 0.28
          setFlyingBlock({
            col: next.col,
            row: next.row,
            isAccent,
            isFlying: false,
            flyDuration: (placeTime / 1000).toFixed(2),
          })
          setRobotPhase('LIFTING')
          await sleep(liftTime)
          if (!isMounted) break

          // 4. PLACING: Block physically glides across to the building slot
          setFlyingBlock({
            col: next.col,
            row: next.row,
            isAccent,
            isFlying: true,
            flyDuration: (placeTime / 1000).toFixed(2),
          })
          setRobotPhase('PLACING')
          await sleep(placeTime)
          if (!isMounted) break

          // 5. SNAP: Block permanently enters grid with flash ripple
          const newId = `b-${next.col}-${next.row}-${Date.now()}`
          const newBlock = {
            id: newId,
            col: next.col,
            row: next.row,
            isAccent,
          }
          setBlocks((prev) => [...prev, newBlock])
          setSnappedBlockId(newId)
          setFlyingBlock(null)
          setRobotPhase('SNAP')
          await sleep(snapTime)
          if (!isMounted) break
          setSnappedBlockId(null)

          // Randomized breath / thinking pause between blocks
          await sleep(interBlockPause)
          if (!isMounted) break
        }
      }
    }

    runEngine()

    return () => {
      isMounted = false
    }
  }, [isLeft])

  // --- Randomized Gravity Decay Loop (Independent Timings per Side) ---
  useEffect(() => {
    let isMounted = true

    async function runDecay() {
      // Staggered initial grace period
      const initialGrace = isLeft
        ? 5500 + Math.random() * 3000
        : 8000 + Math.random() * 4000
      await sleep(initialGrace)

      while (isMounted) {
        // Drop blocks at irregular, randomized intervals (between 6.5s and 14s)
        const nextDropDelay = isLeft
          ? 6500 + Math.random() * 6500
          : 7500 + Math.random() * 7500
        await sleep(nextDropDelay)
        if (!isMounted) break

        const cur = blocksRef.current
        // Keep a solid foundation of at least 4 base blocks
        if (cur.length > 4) {
          const topBlocks = cur.filter(
            (b) =>
              !cur.some((other) => other.col === b.col && other.row > b.row),
          )
          if (topBlocks.length > 0) {
            const victim =
              topBlocks[Math.floor(Math.random() * topBlocks.length)]
            setFallingBlockId(victim.id)

            // Random drop physics speed between 650ms and 950ms
            const dropDuration = 650 + Math.random() * 300
            await sleep(dropDuration)
            if (!isMounted) break

            setBlocks((prev) => prev.filter((b) => b.id !== victim.id))
            setFallingBlockId(null)
          }
        }
      }
    }

    runDecay()

    return () => {
      isMounted = false
    }
  }, [isLeft])

  // Mouse pupil tracking
  const handleMouseMove = (e) => {
    if (!botRef.current) return
    const rect = botRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = Math.max(-3, Math.min(3, (e.clientX - centerX) / 12))
    const dy = Math.max(-2.5, Math.min(2.5, (e.clientY - centerY) / 10))
    setPupilOffset({ x: dx, y: dy })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (onInteract) onInteract('hover', { botId, phase: robotPhase })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPupilOffset({ x: 0, y: 0 })
    if (onInteract) onInteract('leave', { botId, phase: robotPhase })
  }

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 500)
    if (onInteract) onInteract('click', { botId, phase: robotPhase })
  }

  // Floating Status Text
  const getStatusText = () => {
    if (robotPhase === 'SLEEPING') return `💤 ${botName} // Sleep Mode`
    if (robotPhase === 'WAKING') return `⚡ ${botName} // Alert: Repairing!`
    if (robotPhase === 'PLACING') return `🧱 ${botName} // Placing Block`
    if (robotPhase === 'LIFTING') return `⚡ ${botName} // Hoisting Block`
    if (robotPhase === 'FETCHING') return `🔍 ${botName} // Fetching Material`
    return `⚙️ ${botName} // Building ${blocks.length}/${totalCapacity}`
  }

  // Calculate dynamic arm angles based on current robot action
  // Left shoulder at (28, 76), Right shoulder at (84, 76)
  let leftArmRotate = 10
  let rightArmRotate = -10
  let bodyYOffset = 0
  let headRotate = 0
  let headYOffset = 0

  if (robotPhase === 'FETCHING') {
    leftArmRotate = 40
    rightArmRotate = -40
    headRotate = isLeft ? -4 : 4
    headYOffset = 3
    bodyYOffset = 2
  } else if (robotPhase === 'LIFTING') {
    leftArmRotate = -68
    rightArmRotate = 68
    headYOffset = -2
    bodyYOffset = -3
  } else if (robotPhase === 'PLACING') {
    // Both arms point towards the building structure!
    if (isLeft) {
      leftArmRotate = -85
      rightArmRotate = -50
      headRotate = -8
    } else {
      leftArmRotate = 50
      rightArmRotate = 85
      headRotate = 8
    }
    bodyYOffset = -2
  } else if (robotPhase === 'SNAP') {
    leftArmRotate = -18
    rightArmRotate = 18
    bodyYOffset = -6 // Cheerful bounce!
    headRotate = 0
  } else if (robotPhase === 'SLEEPING') {
    leftArmRotate = 6
    rightArmRotate = -6
    bodyYOffset = 4
    headRotate = isLeft ? 4 : -4
  } else if (robotPhase === 'WAKING') {
    leftArmRotate = -55
    rightArmRotate = 55
    bodyYOffset = -8 // Startled jump!
    headRotate = 0
  }

  return (
    <div className="relative flex items-end gap-3.5 select-none pointer-events-auto">
      {/* Keyframe Animations */}
      <style>{`
        @keyframes animZ1 {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          40% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-24px) scale(1.2); }
        }
        @keyframes animZ2 {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          40% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-26px) scale(1.2); }
        }
        @keyframes animZ3 {
          0% { opacity: 0; transform: translateY(0) scale(0.6); }
          40% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-30px) scale(1.3); }
        }
        @keyframes animSnapRipple {
          0% { transform: scale(0.85); filter: drop-shadow(0 0 16px rgba(0, 184, 176, 0.9)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 22px rgba(102, 102, 255, 0.85)); }
          100% { transform: scale(1); filter: drop-shadow(0 2px 6px rgba(0, 0, 34, 0.1)); }
        }
        @keyframes animGravityFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          30% { transform: translateY(12px) rotate(4deg); }
          100% { transform: translateY(140px) rotate(20deg); opacity: 0; }
        }
        @keyframes animBlueprintBlink {
          0%, 100% { opacity: 0.4; stroke-width: 1.5; }
          50% { opacity: 1; stroke-width: 2.8; }
        }
        @keyframes animIdleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .anim-z-1 { animation: animZ1 2.2s infinite ease-out; }
        .anim-z-2 { animation: animZ2 2.2s infinite ease-out 0.7s; }
        .anim-z-3 { animation: animZ3 2.2s infinite ease-out 1.4s; }
        .anim-snap { animation: animSnapRipple 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .anim-fall { animation: animGravityFall 0.75s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards; }
        .anim-blueprint { animation: animBlueprintBlink 1s infinite ease-in-out; }
        .anim-bot-idle { animation: animIdleFloat 3.2s infinite ease-in-out; }
      `}</style>

      {/* LEFT SIDE: Building on left, Robot on right */}
      {isLeft && (
        <BuildingGrid
          side="left"
          blocks={blocks}
          columnCapacities={columnCapacities}
          fallingBlockId={fallingBlockId}
          snappedBlockId={snappedBlockId}
          targetSlot={targetSlot}
          flyingBlock={flyingBlock}
          blockSize={blockSize}
          gap={gap}
          totalWidth={totalWidth}
          totalHeight={totalHeight}
        />
      )}

      {/* Vector Robot with Articulated Limbs */}
      <div
        ref={botRef}
        className="relative flex flex-col items-center cursor-pointer select-none transition-transform duration-200 hover:-translate-y-1.5 active:scale-95 z-30"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={getStatusText()}
      >
        {/* Floating Tooltip Status Badge - Shifted outward so it never overlaps center buttons */}
        <div
          className={`absolute -top-7 ${
            isLeft ? '-left-2' : '-right-2'
          } px-3 py-1 bg-white/95 backdrop-blur-md border rounded-full shadow-md shadow-[#000022]/10 text-[11px] font-mono font-bold text-[#000022] whitespace-nowrap pointer-events-none transition-all duration-200 z-50 ${
            isHovered ||
            robotPhase === 'SLEEPING' ||
            robotPhase === 'WAKING' ||
            robotPhase === 'PLACING'
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-1.5 scale-95'
          } ${
            robotPhase === 'SLEEPING'
              ? 'border-[#6666ff]/40 text-[#4200ff]'
              : robotPhase === 'WAKING'
              ? 'border-[#00b8b0] text-[#008e87]'
              : 'border-[#6666ff]/30'
          }`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
              robotPhase === 'SLEEPING'
                ? 'bg-[#6666ff]'
                : 'bg-[#00b8b0] shadow-[0_0_8px_#00b8b0] animate-pulse'
            }`}
          />
          {getStatusText()}
        </div>

        {/* SVG Robot (112px x 136px) */}
        <svg
          width="112"
          height="136"
          viewBox="0 0 112 136"
          className="overflow-visible drop-shadow-[0_8px_20px_rgba(0,0,34,0.12)] anim-bot-idle"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={`botBodyGrad_${botId}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ecf1f8" />
            </linearGradient>

            <linearGradient
              id={`visorScreenGrad_${botId}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1a1c2e" />
              <stop offset="100%" stopColor="#080914" />
            </linearGradient>

            <linearGradient
              id={`corePowerGrad_${botId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6666ff" />
              <stop offset="100%" stopColor="#00b8b0" />
            </linearGradient>
          </defs>

          {/* Ground Contact Shadow */}
          <ellipse
            cx="56"
            cy="124"
            rx="28"
            ry="6"
            fill="rgba(0, 0, 34, 0.12)"
          />

          {/* Supply Material Rocks on Ground */}
          <g transform="translate(42, 114)">
            <rect
              x="0"
              y="2"
              width="18"
              height="9"
              rx="2.5"
              fill="#e2e8f0"
              stroke="rgba(0,0,34,0.22)"
              strokeWidth="1"
            />
            <rect
              x="14"
              y="4"
              width="15"
              height="7"
              rx="2"
              fill="#cbd5e1"
              stroke="rgba(0,0,34,0.22)"
              strokeWidth="1"
            />
          </g>

          {/* Floating ZZZ's when in Sleep Mode */}
          {robotPhase === 'SLEEPING' && (
            <g transform="translate(64, 24)">
              <text
                x="0"
                y="0"
                className="anim-z-1 font-mono font-bold text-sm fill-[#6666ff]"
              >
                z
              </text>
              <text
                x="7"
                y="-8"
                className="anim-z-2 font-mono font-extrabold text-base fill-[#4200ff]"
              >
                Z
              </text>
              <text
                x="16"
                y="-18"
                className="anim-z-3 font-mono font-black text-lg fill-[#00b8b0]"
              >
                Z
              </text>
            </g>
          )}

          {/* Whole Robot Reactive Body Group */}
          <g
            style={{
              transform: `translateY(${bodyYOffset + (isClicked ? -8 : 0)}px)`,
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Robot Head (Tilts & looks dynamically!) */}
            <g
              transform={`rotate(${headRotate}, 56, 49) translate(0, ${headYOffset})`}
              style={{ transition: 'transform 0.3s ease' }}
            >
              {/* Antenna with beacon */}
              <line
                x1="56"
                y1="32"
                x2="56"
                y2="16"
                stroke="#64748b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="56"
                cy="13"
                r="5.5"
                fill={
                  robotPhase === 'SLEEPING'
                    ? '#8c909e'
                    : isHovered
                    ? '#00b8b0'
                    : '#6666ff'
                }
                filter={
                  robotPhase !== 'SLEEPING'
                    ? 'drop-shadow(0 0 6px #6666ff)'
                    : undefined
                }
              />

              {/* Ear Nodes */}
              <rect x="28" y="42" width="6" height="16" rx="3" fill="#475569" />
              <rect x="78" y="42" width="6" height="16" rx="3" fill="#475569" />

              {/* Head Shell */}
              <rect
                x="32"
                y="30"
                width="48"
                height="38"
                rx="11"
                fill={`url(#botBodyGrad_${botId})`}
                stroke="rgba(0, 0, 34, 0.25)"
                strokeWidth="2.2"
              />

              {/* Visor Screen */}
              <rect
                x="37.5"
                y="37"
                width="37"
                height="22"
                rx="7"
                fill={`url(#visorScreenGrad_${botId})`}
              />

              {/* Eyes / Pupils with state expressions */}
              <g
                style={{
                  transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                }}
              >
                {robotPhase === 'SLEEPING' ? (
                  // Sleeping horizontal closed eyelids: - -
                  <>
                    <line
                      x1="43"
                      y1="48"
                      x2="51"
                      y2="48"
                      stroke="#6666ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <line
                      x1="61"
                      y1="48"
                      x2="69"
                      y2="48"
                      stroke="#6666ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                ) : robotPhase === 'WAKING' ? (
                  // Startled alert eyes: ! !
                  <>
                    <circle cx="47" cy="46" r="4.5" fill="#00b8b0" />
                    <circle cx="65" cy="46" r="4.5" fill="#00b8b0" />
                    <circle cx="48" cy="45" r="1.5" fill="#ffffff" />
                    <circle cx="66" cy="45" r="1.5" fill="#ffffff" />
                  </>
                ) : isHovered ? (
                  // Happy curved eyes: ^ ^
                  <>
                    <path
                      d="M 43 49 Q 47 43 51 49"
                      stroke="#00b8b0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 61 49 Q 65 43 69 49"
                      stroke="#00b8b0"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </>
                ) : (
                  // Normal glowing cyan focused pupils
                  <>
                    <circle cx="47" cy="48" r="3.6" fill="#00b8b0" />
                    <circle cx="65" cy="48" r="3.6" fill="#00b8b0" />
                    <circle cx="48.5" cy="46.5" r="1.3" fill="#ffffff" />
                    <circle cx="66.5" cy="46.5" r="1.3" fill="#ffffff" />
                  </>
                )}
              </g>
            </g>

            {/* Neck Joint */}
            <rect x="50" y="68" width="12" height="5" rx="2.5" fill="#64748b" />

            {/* Torso */}
            <rect
              x="34"
              y="73"
              width="44"
              height="33"
              rx="9"
              fill={`url(#botBodyGrad_${botId})`}
              stroke="rgba(0, 0, 34, 0.25)"
              strokeWidth="2.2"
            />

            {/* Power Core */}
            <circle
              cx="56"
              cy="87"
              r="7.5"
              fill={`url(#corePowerGrad_${botId})`}
              filter="drop-shadow(0 0 6px rgba(102, 102, 255, 0.6))"
            />
            <circle cx="56" cy="87" r="2.8" fill="#ffffff" />

            {/* Belt Trim */}
            <line
              x1="39"
              y1="97"
              x2="73"
              y2="97"
              stroke="rgba(0, 0, 34, 0.22)"
              strokeWidth="2"
            />

            {/* Feet */}
            <rect
              x="41"
              y="106"
              width="11"
              height="9"
              rx="4.5"
              fill="#475569"
            />
            <rect
              x="60"
              y="106"
              width="11"
              height="9"
              rx="4.5"
              fill="#475569"
            />

            {/* LEFT ARTICULATED ARM & HAND (Rotates from shoulder at 30, 76) */}
            <g
              transform={`rotate(${leftArmRotate}, 30, 76)`}
              style={{
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Shoulder joint */}
              <circle cx="30" cy="76" r="5" fill="#64748b" />
              {/* Upper arm */}
              <rect
                x="25"
                y="74"
                width="9"
                height="18"
                rx="4"
                fill="#cbd5e1"
                stroke="rgba(0,0,34,0.22)"
                strokeWidth="1.2"
              />
              {/* Forearm & Wrist */}
              <rect
                x="26"
                y="90"
                width="7"
                height="14"
                rx="3.5"
                fill="#94a3b8"
              />
              {/* Mechanical Gripping Hand */}
              <circle cx="29.5" cy="105" r="4.5" fill="#475569" />
              <path
                d="M 27 107 C 23 111 23 116 28 119"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 32 107 C 36 111 36 116 31 119"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* RIGHT ARTICULATED ARM & HAND (Rotates from shoulder at 82, 76) */}
            <g
              transform={`rotate(${rightArmRotate}, 82, 76)`}
              style={{
                transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Shoulder joint */}
              <circle cx="82" cy="76" r="5" fill="#64748b" />
              {/* Upper arm */}
              <rect
                x="78"
                y="74"
                width="9"
                height="18"
                rx="4"
                fill="#cbd5e1"
                stroke="rgba(0,0,34,0.22)"
                strokeWidth="1.2"
              />
              {/* Forearm & Wrist */}
              <rect
                x="79"
                y="90"
                width="7"
                height="14"
                rx="3.5"
                fill="#94a3b8"
              />
              {/* Mechanical Gripping Hand */}
              <circle cx="82.5" cy="105" r="4.5" fill="#475569" />
              <path
                d="M 80 107 C 76 111 76 116 81 119"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 85 107 C 89 111 89 116 84 119"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>

          {/* FETCHING PHASE: Tractor beam down to supply */}
          {robotPhase === 'FETCHING' && (
            <g>
              <line
                x1="28"
                y1="115"
                x2="48"
                y2="119"
                stroke="#00b8b0"
                strokeWidth="2.5"
                strokeDasharray="3 3"
                opacity="0.9"
              />
              <line
                x1="84"
                y1="115"
                x2="56"
                y2="119"
                stroke="#6666ff"
                strokeWidth="2.5"
                strokeDasharray="3 3"
                opacity="0.9"
              />
            </g>
          )}

          {/* LIFTING PHASE: Carried block actively held in robot hands */}
          {robotPhase === 'LIFTING' && flyingBlock && (
            <g transform="translate(42, 52)">
              {/* Energy field between hands */}
              <line
                x1="-12"
                y1="14"
                x2="0"
                y2="14"
                stroke="#00b8b0"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />
              <line
                x1="40"
                y1="14"
                x2="28"
                y2="14"
                stroke="#6666ff"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />
              <rect
                x="0"
                y="0"
                width="28"
                height="28"
                rx="5"
                fill="#ffffff"
                stroke={flyingBlock.isAccent ? '#00b8b0' : '#6666ff'}
                strokeWidth="2.5"
                filter="drop-shadow(0 0 12px rgba(102, 102, 255, 0.85))"
              />
              <circle
                cx="14"
                cy="14"
                r="3.5"
                fill={flyingBlock.isAccent ? '#00b8b0' : '#6666ff'}
              />
            </g>
          )}
        </svg>
      </div>

      {/* RIGHT SIDE: Robot on left, Building on right */}
      {!isLeft && (
        <BuildingGrid
          side="right"
          blocks={blocks}
          columnCapacities={columnCapacities}
          fallingBlockId={fallingBlockId}
          snappedBlockId={snappedBlockId}
          targetSlot={targetSlot}
          flyingBlock={flyingBlock}
          blockSize={blockSize}
          gap={gap}
          totalWidth={totalWidth}
          totalHeight={totalHeight}
        />
      )}
    </div>
  )
}

/**
 * BuildingGrid
 * The 2D Flat Modular Stepped Structure with Active Flying & Snapping Block Animations
 */
function BuildingGrid({
  side,
  blocks,
  columnCapacities,
  fallingBlockId,
  snappedBlockId,
  targetSlot,
  flyingBlock,
  blockSize,
  gap,
  totalWidth,
  totalHeight,
}) {
  const isLeft = side === 'left'

  // Coordinates of the robot hands relative to this building SVG
  const robotHandX = isLeft ? totalWidth + 48 : -48
  const robotHandY = totalHeight - 65

  // Calculate target slot coordinates
  const getSlotCoords = (col, row) => ({
    x: col * (blockSize + gap) + 8,
    y: totalHeight - 8 - (row + 1) * (blockSize + gap),
  })

  return (
    <div className="relative z-0 pointer-events-auto">
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="block overflow-visible drop-shadow-[0_4px_16px_rgba(0,0,34,0.08)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`gridBlockGrad_${side}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f4f9" />
          </linearGradient>

          <linearGradient
            id={`gridAccentGrad_${side}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e8f8f7" />
          </linearGradient>
        </defs>

        {/* Foundation Dashed Anchor Line */}
        <line
          x1={4}
          y1={totalHeight - 4}
          x2={totalWidth - 4}
          y2={totalHeight - 4}
          stroke="rgba(0, 0, 34, 0.22)"
          strokeWidth="2.5"
          strokeDasharray="6 4"
        />

        {/* Blueprint Ghost Outlines for all potential capacity slots */}
        {columnCapacities.map((maxCap, colIdx) => {
          const x = colIdx * (blockSize + gap) + 8
          return Array.from({ length: maxCap }).map((_, rowIdx) => {
            const y = totalHeight - 8 - (rowIdx + 1) * (blockSize + gap)
            return (
              <rect
                key={`ghost_${colIdx}_${rowIdx}`}
                x={x}
                y={y}
                width={blockSize}
                height={blockSize}
                rx={6}
                stroke="rgba(0, 0, 34, 0.08)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                fill="none"
              />
            )
          })
        })}

        {/* Existing Built Blocks */}
        {blocks.map((block) => {
          const { x, y } = getSlotCoords(block.col, block.row)
          const isFalling = block.id === fallingBlockId
          const isSnapped = block.id === snappedBlockId

          return (
            <g
              key={block.id}
              className={`${isSnapped ? 'anim-snap' : ''} ${
                isFalling ? 'anim-fall' : ''
              }`}
              style={{
                transformOrigin: `${x + blockSize / 2}px ${
                  y + blockSize / 2
                }px`,
              }}
            >
              <rect
                x={x}
                y={y}
                width={blockSize}
                height={blockSize}
                rx={6.5}
                fill={
                  block.isAccent
                    ? `url(#gridAccentGrad_${side})`
                    : `url(#gridBlockGrad_${side})`
                }
                stroke={block.isAccent ? '#00b8b0' : 'rgba(0, 0, 34, 0.25)'}
                strokeWidth={block.isAccent ? '2.5' : '2'}
              />

              {/* Vector Bevel Highlight */}
              <line
                x1={x + 4}
                y1={y + 3.5}
                x2={x + blockSize - 4}
                y2={y + 3.5}
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Accent Block Cyan Tech Dot */}
              {block.isAccent && (
                <g>
                  <circle
                    cx={x + blockSize / 2}
                    cy={y + blockSize / 2}
                    r={5}
                    fill="#00b8b0"
                    opacity="0.2"
                  />
                  <circle
                    cx={x + blockSize / 2}
                    cy={y + blockSize / 2}
                    r={3}
                    fill="#00b8b0"
                  />
                  <circle
                    cx={x + blockSize / 2}
                    cy={y + blockSize / 2}
                    r={1.2}
                    fill="#ffffff"
                  />
                </g>
              )}
            </g>
          )
        })}

        {/* Active Target Blueprint Slot (Pulsing outline while acquiring / placing) */}
        {targetSlot && (
          <g className="anim-blueprint">
            <rect
              x={getSlotCoords(targetSlot.col, targetSlot.row).x}
              y={getSlotCoords(targetSlot.col, targetSlot.row).y}
              width={blockSize}
              height={blockSize}
              rx={6.5}
              stroke="#00b8b0"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              fill="rgba(0, 184, 176, 0.15)"
            />
          </g>
        )}

        {/* FLYING CARRIED BLOCK (Smoothly glides across from robot hands to target slot!) */}
        {flyingBlock && targetSlot && (
          <g
            style={{
              transform: flyingBlock.isFlying
                ? `translate(${
                    getSlotCoords(flyingBlock.col, flyingBlock.row).x
                  }px, ${getSlotCoords(flyingBlock.col, flyingBlock.row).y}px)`
                : `translate(${robotHandX}px, ${robotHandY}px)`,
              transition: `transform ${
                flyingBlock.flyDuration || '0.8'
              }s cubic-bezier(0.22, 1, 0.36, 1)`,
              transformOrigin: '0 0',
            }}
          >
            {/* Guidance beam connecting to robot */}
            <line
              x1={blockSize / 2}
              y1={blockSize / 2}
              x2={
                robotHandX -
                (flyingBlock.isFlying
                  ? getSlotCoords(flyingBlock.col, flyingBlock.row).x
                  : robotHandX)
              }
              y2={
                robotHandY -
                (flyingBlock.isFlying
                  ? getSlotCoords(flyingBlock.col, flyingBlock.row).y
                  : robotHandY)
              }
              stroke="rgba(0, 184, 176, 0.6)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            {/* The Moving Block */}
            <rect
              x={0}
              y={0}
              width={blockSize}
              height={blockSize}
              rx={6.5}
              fill="#ffffff"
              stroke={flyingBlock.isAccent ? '#00b8b0' : '#6666ff'}
              strokeWidth="2.5"
              filter="drop-shadow(0 0 14px rgba(0, 184, 176, 0.85))"
            />
            <circle
              cx={blockSize / 2}
              cy={blockSize / 2}
              r={4}
              fill={flyingBlock.isAccent ? '#00b8b0' : '#6666ff'}
            />
          </g>
        )}
      </svg>
    </div>
  )
}

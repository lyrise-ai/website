import React, { useEffect, useRef } from 'react'

/**
 * HeroDotMatrixSimulationCanvas (Direction B: Crisp Blueprint Architecture)
 *
 * Fixes all previous flaws:
 * 1. NO CLIPPED EDGES: Copy quiet zone is strictly bounded to the center copy column.
 *    Towers & robots are anchored to outer thirds and NEVER clipped.
 * 2. MODULAR TILE SEPARATION: Blocks feature crisp structural frame borders,
 *    corner rivets, center cores, and wide negative-space channels (no amorphous blobs).
 * 3. HIGH-DEFINITION RECOGNIZABLE ROBOT: Large multi-tone chassis, glowing visor screen,
 *    articulated arms with mechanical claws, chest power core, and expressive sensor eyes.
 * 4. TACTILE SIMULATION: Illuminated tractor beam, smooth block transit, snap ripples,
 *    gravity decay, and independent asynchronous execution.
 */

function hash(a, b) {
  const sin = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123
  return sin - Math.floor(sin)
}

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function HeroDotMatrixSimulationCanvas({ onAgentInteract }) {
  const canvasRef = useRef(null)

  // Simulation state refs
  const leftStateRef = useRef({
    side: 'left',
    phase: 'FETCHING',
    targetSlot: null,
    flyingBlock: null,
    fallingBlockId: null,
    snappedBlockId: null,
    blocks: [
      { id: 'l-0-0', col: 0, row: 0, isAccent: false },
      { id: 'l-1-0', col: 1, row: 0, isAccent: false },
      { id: 'l-2-0', col: 2, row: 0, isAccent: true },
      { id: 'l-0-1', col: 0, row: 1, isAccent: false },
      { id: 'l-1-1', col: 1, row: 1, isAccent: false },
    ],
  })

  const rightStateRef = useRef({
    side: 'right',
    phase: 'FETCHING',
    targetSlot: null,
    flyingBlock: null,
    fallingBlockId: null,
    snappedBlockId: null,
    blocks: [
      { id: 'r-4-0', col: 4, row: 0, isAccent: false },
      { id: 'r-3-0', col: 3, row: 0, isAccent: false },
      { id: 'r-2-0', col: 2, row: 0, isAccent: true },
      { id: 'r-1-0', col: 1, row: 0, isAccent: false },
      { id: 'r-0-0', col: 0, row: 0, isAccent: false },
      { id: 'r-4-1', col: 4, row: 1, isAccent: false },
      { id: 'r-3-1', col: 3, row: 1, isAccent: true },
    ],
  })

  const mousePosRef = useRef({ x: -1000, y: -1000 })

  // --- 1. Left Agent Autonomous Construction Loop ---
  useEffect(() => {
    let isMounted = true
    const leftCaps = [5, 4, 3, 2, 1]

    const findNextLeftSlot = () => {
      const cur = leftStateRef.current.blocks
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (r < leftCaps[c]) {
            if (!cur.some((b) => b.col === c && b.row === r)) {
              return { col: c, row: r }
            }
          }
        }
      }
      return null
    }

    async function runLeftLoop() {
      await sleep(350 + Math.random() * 250)

      while (isMounted) {
        const next = findNextLeftSlot()
        if (!next) {
          leftStateRef.current.phase = 'SLEEPING'
          leftStateRef.current.targetSlot = null
          leftStateRef.current.flyingBlock = null
          while (isMounted && !findNextLeftSlot()) {
            await sleep(500)
          }
          if (isMounted) {
            leftStateRef.current.phase = 'WAKING'
            await sleep(600)
          }
        } else {
          // Fetching
          leftStateRef.current.targetSlot = next
          leftStateRef.current.phase = 'FETCHING'
          await sleep(420 + Math.random() * 180)
          if (!isMounted) break

          // Lifting
          const isAccent = Math.random() < 0.28
          leftStateRef.current.phase = 'LIFTING'
          leftStateRef.current.flyingBlock = {
            col: next.col,
            row: next.row,
            isAccent,
            progress: 0,
          }
          await sleep(460 + Math.random() * 160)
          if (!isMounted) break

          // Placing (Flying block travel)
          leftStateRef.current.phase = 'PLACING'
          const travelSteps = 14
          for (let s = 1; s <= travelSteps; s++) {
            if (!isMounted) break
            if (leftStateRef.current.flyingBlock) {
              leftStateRef.current.flyingBlock.progress = s / travelSteps
            }
            await sleep(30)
          }
          if (!isMounted) break

          // Snap
          const newId = `l-${next.col}-${next.row}-${Date.now()}`
          leftStateRef.current.blocks.push({
            id: newId,
            col: next.col,
            row: next.row,
            isAccent,
          })
          leftStateRef.current.snappedBlockId = newId
          leftStateRef.current.flyingBlock = null
          leftStateRef.current.phase = 'SNAP'
          await sleep(320)
          if (!isMounted) break
          leftStateRef.current.snappedBlockId = null

          await sleep(260 + Math.random() * 240)
        }
      }
    }

    runLeftLoop()
    return () => {
      isMounted = false
    }
  }, [])

  // --- 2. Right Agent Autonomous Construction Loop ---
  useEffect(() => {
    let isMounted = true
    const rightCaps = [1, 2, 3, 4, 5]

    const findNextRightSlot = () => {
      const cur = rightStateRef.current.blocks
      for (let r = 0; r < 5; r++) {
        for (let c = 4; c >= 0; c--) {
          if (r < rightCaps[c]) {
            if (!cur.some((b) => b.col === c && b.row === r)) {
              return { col: c, row: r }
            }
          }
        }
      }
      return null
    }

    async function runRightLoop() {
      await sleep(500 + Math.random() * 350)

      while (isMounted) {
        const next = findNextRightSlot()
        if (!next) {
          rightStateRef.current.phase = 'SLEEPING'
          rightStateRef.current.targetSlot = null
          rightStateRef.current.flyingBlock = null
          while (isMounted && !findNextRightSlot()) {
            await sleep(500)
          }
          if (isMounted) {
            rightStateRef.current.phase = 'WAKING'
            await sleep(600)
          }
        } else {
          // Fetching
          rightStateRef.current.targetSlot = next
          rightStateRef.current.phase = 'FETCHING'
          await sleep(450 + Math.random() * 200)
          if (!isMounted) break

          // Lifting
          const isAccent = Math.random() < 0.28
          rightStateRef.current.phase = 'LIFTING'
          rightStateRef.current.flyingBlock = {
            col: next.col,
            row: next.row,
            isAccent,
            progress: 0,
          }
          await sleep(480 + Math.random() * 180)
          if (!isMounted) break

          // Placing (Flying block travel)
          rightStateRef.current.phase = 'PLACING'
          const travelSteps = 15
          for (let s = 1; s <= travelSteps; s++) {
            if (!isMounted) break
            if (rightStateRef.current.flyingBlock) {
              rightStateRef.current.flyingBlock.progress = s / travelSteps
            }
            await sleep(30)
          }
          if (!isMounted) break

          // Snap
          const newId = `r-${next.col}-${next.row}-${Date.now()}`
          rightStateRef.current.blocks.push({
            id: newId,
            col: next.col,
            row: next.row,
            isAccent,
          })
          rightStateRef.current.snappedBlockId = newId
          rightStateRef.current.flyingBlock = null
          rightStateRef.current.phase = 'SNAP'
          await sleep(340)
          if (!isMounted) break
          rightStateRef.current.snappedBlockId = null

          await sleep(280 + Math.random() * 250)
        }
      }
    }

    runRightLoop()
    return () => {
      isMounted = false
    }
  }, [])

  // --- 3. Independent Gravity Decay Loop ---
  useEffect(() => {
    let isMounted = true

    async function runDecays() {
      await sleep(5000)

      while (isMounted) {
        await sleep(5500 + Math.random() * 4000)
        if (!isMounted) break

        const isLeftDrop = Math.random() < 0.5
        const state = isLeftDrop ? leftStateRef.current : rightStateRef.current
        const cur = state.blocks

        if (cur.length > 4) {
          const topBlocks = cur.filter(
            (b) =>
              !cur.some((other) => other.col === b.col && other.row > b.row),
          )
          if (topBlocks.length > 0) {
            const victim =
              topBlocks[Math.floor(Math.random() * topBlocks.length)]
            state.fallingBlockId = victim.id

            await sleep(500)
            if (!isMounted) break

            state.blocks = state.blocks.filter((b) => b.id !== victim.id)
            state.fallingBlockId = null
          }
        }
      }
    }

    runDecays()
    return () => {
      isMounted = false
    }
  }, [])

  // --- 4. Main Canvas Render Loop ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    const t0 = performance.now()
    let animationFrameId

    const fieldCanvas = document.createElement('canvas')
    const fieldCtx = fieldCanvas.getContext('2d', { willReadFrequently: true })

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const render = () => {
      const W = canvas.clientWidth || window.innerWidth
      const H = canvas.clientHeight || window.innerHeight
      if (W === 0 || H === 0) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      const DPR = Math.min(2, window.devicePixelRatio || 1)
      if (canvas.width !== W * DPR || canvas.height !== H * DPR) {
        canvas.width = W * DPR
        canvas.height = H * DPR
      }

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // High-Resolution Micro-Dot Grid: Keeps each block at 11-13 dots wide x 9-10 dots high (10x10+ resolution)
      const step = Math.max(2.4, W / 480)
      const rowStep = step * 1.38 // Crisp horizontal scanline pitch with high vertical definition
      const cols = Math.ceil(W / step)
      const rows = Math.ceil(H / rowStep)
      const R = step * 0.44

      if (fieldCanvas.width !== cols || fieldCanvas.height !== rows) {
        fieldCanvas.width = cols
        fieldCanvas.height = rows
      }

      // Draw high-definition blueprint scene into offscreen field
      fieldCtx.save()
      fieldCtx.fillStyle = '#ffffff'
      fieldCtx.fillRect(0, 0, cols, rows)
      fieldCtx.scale(cols / W, rows / H)

      const now = performance.now()
      const t = (now - t0) / 1000

      // Dynamic breathing cycles
      const breathLeft = 1 + 0.035 * Math.sin(t * 1.8)
      const breathRight = 1 + 0.035 * Math.sin(t * 1.8 + Math.PI)

      // Query real bounding box of the CTA buttons in canvas coordinates
      let btnBox = null
      const ctaEl = document.getElementById('hero-cta-group')
      if (ctaEl && canvas) {
        const cr = ctaEl.getBoundingClientRect()
        const canr = canvas.getBoundingClientRect()
        btnBox = {
          left: cr.left - canr.left,
          right: cr.right - canr.left,
          top: cr.top - canr.top,
          bottom: cr.bottom - canr.top,
          width: cr.width,
          height: cr.height,
        }
      }

      // Responsive Mode: <1024px uses dedicated grounded mobile/tablet builder to guarantee zero CTA collision
      const isMobile = W < 1024

      if (isMobile) {
        // Single centered autonomous builder anchored below the buttons
        drawMobileScene(
          fieldCtx,
          leftStateRef.current,
          W,
          H,
          breathLeft,
          t,
          mousePosRef.current,
          btnBox,
        )
      } else {
        // Dual corner builders framing the screen outer margins
        drawBlueprintScene(
          fieldCtx,
          'left',
          leftStateRef.current,
          W,
          H,
          breathLeft,
          t,
          mousePosRef.current,
          btnBox,
        )
        drawBlueprintScene(
          fieldCtx,
          'right',
          rightStateRef.current,
          W,
          H,
          breathRight,
          t,
          mousePosRef.current,
          btnBox,
        )
      }

      fieldCtx.restore()

      // Read back pixel luminance
      const imgData = fieldCtx.getImageData(0, 0, cols, rows).data
      const tick = Math.floor(t * 7) // 7 Hz row glitch tick

      // Precision Copy Quiet Zone bounds (Softly dims dots directly behind text for crystal legibility)
      const qzLeft = isMobile
        ? Math.max(16, W * 0.08)
        : btnBox
        ? Math.max(0, btnBox.left - 48)
        : W * 0.25
      const qzRight = isMobile
        ? Math.min(W - 16, W * 0.92)
        : btnBox
        ? Math.min(W, btnBox.right + 48)
        : W * 0.75
      const qzTop = H * 0.08
      const qzBottom = btnBox ? btnBox.bottom + 18 : H * 0.65

      const pathAmbient = new Path2D()
      const pathDark = new Path2D()
      const pathCyan = new Path2D()
      const pathPurple = new Path2D()

      for (let j = 0; j < rows; j++) {
        // Hardware row jump glitch
        let shift = 0
        if (hash(j, tick) > 0.965) {
          shift = Math.round((hash(tick, j) - 0.5) * 8)
        }

        const y = (j + 0.5) * rowStep

        for (let i = 0; i < cols; i++) {
          const sampleI = Math.max(0, Math.min(cols - 1, i - shift))
          const idx = (j * cols + sampleI) * 4

          const red = imgData[idx]
          const green = imgData[idx + 1]
          const blue = imgData[idx + 2]

          const lum = red / 255
          let v = Math.max(0, Math.min(1, (1 - lum - 0.08) / 0.44))
          let isAmbientDot = false

          // Kindred Ambient Space Dots: Faint micro-LED matrix in open space
          if (v <= 0.02) {
            const ambientNoise = hash(i * 1.3, j * 1.7)
            if (ambientNoise > 0.38) {
              const wave = Math.sin(t * 1.6 + (i * 0.14 + j * 0.11))
              v = 0.04 + 0.025 * wave
              if (ambientNoise > 0.93) {
                v += 0.05
              }
              isAmbientDot = true
            }
          }

          if (v > 0.02) {
            const x = (i + 0.5) * step

            const isButtonCollision =
              btnBox &&
              x >= btnBox.left - 16 &&
              x <= btnBox.right + 16 &&
              y >= btnBox.top - 12 &&
              y <= btnBox.bottom + 14

            if (!isButtonCollision) {
              // Soft bounding-box Quiet Zone: Only dims dots directly behind the center copy
              if (x > qzLeft && x < qzRight && y > qzTop && y < qzBottom) {
                const edgeDistX = Math.min(x - qzLeft, qzRight - x)
                const edgeDistY = Math.min(y - qzTop, qzBottom - y)
                const edgeDist = Math.min(
                  edgeDistX / (W * 0.08),
                  edgeDistY / (H * 0.08),
                )
                v *= Math.max(0.18, 1 - smoothstep(0, 1, edgeDist))
              }

              if (v > 0.02) {
                // Per-cell dissolve seed & micro-shimmer
                const seed = 0.55 * hash(i, j) + 0.45 * hash(j * 3.1, 7.7)
                v *= 0.88 + 0.12 * Math.sin(t * 3.0 + seed * 38)

                if (isAmbientDot) {
                  const ambientR = Math.max(0.65, R * 0.22)
                  pathAmbient.moveTo(x + ambientR, y)
                  pathAmbient.arc(x, y, ambientR, 0, Math.PI * 2)
                } else {
                  // 4-Level Quantization (Kindred high-contrast spec)
                  let dotRadius = 0
                  if (v >= 0.86) {
                    dotRadius = R * 1.0
                  } else if (v >= 0.64) {
                    dotRadius = R * 0.78
                  } else if (v >= 0.38) {
                    dotRadius = R * 0.54
                  } else if (v >= 0.1) {
                    dotRadius = R * 0.38
                  }

                  if (dotRadius > 0) {
                    const isCyanAccent = green > red + 25 && blue > red + 25
                    const isPurpleAccent = red > green + 25 && blue > green + 25

                    if (isCyanAccent) {
                      pathCyan.moveTo(x + dotRadius, y)
                      pathCyan.arc(x, y, dotRadius, 0, Math.PI * 2)
                    } else if (isPurpleAccent) {
                      pathPurple.moveTo(x + dotRadius, y)
                      pathPurple.arc(x, y, dotRadius, 0, Math.PI * 2)
                    } else {
                      pathDark.moveTo(x + dotRadius, y)
                      pathDark.arc(x, y, dotRadius, 0, Math.PI * 2)
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Execute ultra-fast batched GPU fills (4 single draw calls total)
      ctx.fillStyle = '#cbd5e1'
      ctx.fill(pathAmbient)

      ctx.fillStyle = '#0d0d0d'
      ctx.fill(pathDark)

      ctx.fillStyle = '#00b8b0'
      ctx.fill(pathCyan)

      ctx.fillStyle = '#6666ff'
      ctx.fill(pathPurple)

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none display-block z-10"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

/**
 * Direction B Blueprint Architectural Renderer (High-Resolution 11-13x9-10 Dots Per Block):
 * - Responsive geometry anchored strictly to outer 20% of screen (NEVER collides with CTAs)
 * - Block size dynamically calculated (30px-36px) with 11x9+ micro-dots per block
 * - Grounded floor anchoring (groundY = H - 24), sitting well below the button level
 */
function drawBlueprintScene(
  ctx,
  side,
  state,
  W,
  H,
  breath,
  t,
  mousePos,
  btnBox,
) {
  const isLeft = side === 'left'
  const isPortrait = H > W

  // Strict boundary: Anchor builders to outer margins with guaranteed clearance from CTA buttons
  const maxAllowedLeftX = btnBox
    ? Math.min(btnBox.left - 52, W * 0.28)
    : W * 0.24
  const minAllowedRightX = btnBox
    ? Math.max(btnBox.right + 52, W * 0.72)
    : W * 0.76

  const outerMargin = Math.max(14, Math.min(32, W * 0.02))
  const maxAvailWidth = isLeft
    ? Math.max(110, maxAllowedLeftX - outerMargin - 32)
    : Math.max(110, W - outerMargin - minAllowedRightX - 32)

  const blockSize = Math.max(22, Math.min(32, Math.floor(maxAvailWidth / 5.5)))
  const gap = Math.max(4, Math.floor(blockSize * 0.16))
  const totalCols = 5
  const totalWidth = totalCols * (blockSize + gap) - gap

  // Grounded firmly to the bottom floor of the hero
  const groundY = H - 20
  const buildingX = isLeft ? outerMargin : W - outerMargin - totalWidth
  const botX = isLeft
    ? Math.min(
        buildingX + totalWidth + 24,
        btnBox ? btnBox.left - 40 : buildingX + totalWidth + 24,
      )
    : Math.max(buildingX - 24, btnBox ? btnBox.right + 40 : buildingX - 24)
  const botY = groundY - 44

  ctx.save()

  // --- Foundation Baseline with Measurement Tick Marks ---
  ctx.strokeStyle = '#000022'
  ctx.lineWidth = 1.8
  ctx.setLineDash([5, 4])
  ctx.beginPath()
  ctx.moveTo(buildingX - 10, groundY)
  ctx.lineTo(isLeft ? botX + 32 : buildingX + totalWidth + 10, groundY)
  ctx.stroke()
  ctx.setLineDash([])

  // --- Stepped Modular Blueprint Grid (Height strictly decays as it approaches center) ---
  const columnCaps = isLeft ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5]

  // 1. Ghost Blueprint Outlines for ALL slots (with technical corner L-brackets)
  ctx.strokeStyle = '#c8cdd8'
  ctx.lineWidth = 1.1
  ctx.setLineDash([2, 3])
  for (let c = 0; c < 5; c++) {
    const bx = buildingX + c * (blockSize + gap)
    for (let r = 0; r < columnCaps[c]; r++) {
      const by = groundY - (r + 1) * (blockSize + gap)

      // Collision guard: Never draw ghost outline near buttons
      const isGhostColliding =
        btnBox &&
        bx + blockSize >= btnBox.left - 18 &&
        bx <= btnBox.right + 18 &&
        by <= btnBox.bottom + 16 &&
        by + blockSize >= btnBox.top - 16

      if (!isGhostColliding) {
        ctx.strokeRect(bx, by, blockSize, blockSize)

        // Corner technical brackets for blueprint feel
        ctx.fillStyle = '#94a3b8'
        ctx.fillRect(bx + 1.5, by + 1.5, 2.5, 2.5)
        ctx.fillRect(bx + blockSize - 4, by + 1.5, 2.5, 2.5)
        ctx.fillRect(bx + 1.5, by + blockSize - 4, 2.5, 2.5)
        ctx.fillRect(bx + blockSize - 4, by + blockSize - 4, 2.5, 2.5)
      }
    }
  }
  ctx.setLineDash([])

  // 2. Built Solid Blocks (Architectural High-Resolution Modular Tile)
  state.blocks.forEach((block) => {
    if (block.col >= 5 || block.row >= columnCaps[block.col]) return
    let bx = buildingX + block.col * (blockSize + gap)
    let by = groundY - (block.row + 1) * (blockSize + gap)

    // Hard collision guard against button box
    if (btnBox) {
      if (
        bx + blockSize >= btnBox.left - 18 &&
        bx <= btnBox.right + 18 &&
        by <= btnBox.bottom + 16 &&
        by + blockSize >= btnBox.top - 16
      ) {
        return
      }
    }

    if (block.id === state.fallingBlockId) {
      // Gravity falling block
      by += 28
      bx += isLeft ? 4 : -4
    }

    // Outer structural frame (dense dark border)
    ctx.fillStyle = '#0a0b16'
    ctx.fillRect(bx, by, blockSize, blockSize)

    // Inner recessed chamber (mid-tone gray gives medium dots across the plate!)
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(bx + 4, by + 4, blockSize - 8, blockSize - 8)

    // Bevel highlights: Top & Left specular borders (pure white = empty/pinpoint channel)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(bx + 4, by + 4, blockSize - 8, 2.5)
    ctx.fillRect(bx + 4, by + 4, 2.5, blockSize - 8)

    // 4 Corner Micro-Rivets
    ctx.fillStyle = '#0a0b16'
    ctx.fillRect(bx + 5.5, by + 5.5, 2, 2)
    ctx.fillRect(bx + blockSize - 7.5, by + 5.5, 2, 2)
    ctx.fillRect(bx + 5.5, by + blockSize - 7.5, 2, 2)
    ctx.fillRect(bx + blockSize - 7.5, by + blockSize - 7.5, 2, 2)

    // Micro-Trace Crosshairs connecting core to edges
    ctx.fillStyle = '#94a3b8'
    ctx.fillRect(bx + 8, by + blockSize / 2 - 0.75, blockSize - 16, 1.5)
    ctx.fillRect(bx + blockSize / 2 - 0.75, by + 8, 1.5, blockSize - 16)

    // Center Tech Node
    if (block.isAccent) {
      // Vibrant Cyan Power Core
      ctx.fillStyle = '#0a0b16'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 6.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#00b8b0'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 1.8, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Dark Precision Mechanical Node
      ctx.fillStyle = '#0a0b16'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 5.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 3.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 1.2, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  // 3. Active Target Blueprint Slot (Illuminated pulsing cyan box)
  if (state.targetSlot) {
    const tx = buildingX + state.targetSlot.col * (blockSize + gap)
    const ty = groundY - (state.targetSlot.row + 1) * (blockSize + gap)
    ctx.strokeStyle = '#00b8b0'
    ctx.lineWidth = 2.2
    ctx.strokeRect(tx, ty, blockSize, blockSize)
    ctx.fillStyle = 'rgba(0, 184, 176, 0.22)'
    ctx.fillRect(tx, ty, blockSize, blockSize)
  }

  // 4. Carried / Traveling Block
  if (state.flyingBlock && state.targetSlot) {
    const startX = botX + (isLeft ? -20 : 20)
    const startY = botY - 12
    const endX = buildingX + state.targetSlot.col * (blockSize + gap)
    const endY = groundY - (state.targetSlot.row + 1) * (blockSize + gap)

    const p = state.flyingBlock.progress || 0
    const curX = startX + (endX - startX) * p
    const curY = startY + (endY - startY) * p - Math.sin(p * Math.PI) * 24

    // Dual Tractor guidance laser beams
    ctx.strokeStyle = '#00b8b0'
    ctx.lineWidth = 1.8
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(curX + blockSize / 2, curY + blockSize / 2)
    ctx.stroke()
    ctx.setLineDash([])

    // The Traveling Block
    ctx.fillStyle = state.flyingBlock.isAccent ? '#00b8b0' : '#0a0b16'
    ctx.fillRect(curX, curY, blockSize, blockSize)
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(curX + 4, curY + 4, blockSize - 8, blockSize - 8)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(curX + 4, curY + 4, blockSize - 8, 2.5)
    ctx.fillStyle = state.flyingBlock.isAccent ? '#00b8b0' : '#0a0b16'
    ctx.beginPath()
    ctx.arc(curX + blockSize / 2, curY + blockSize / 2, 4.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // 5. High-Definition Grounded Robot Agent Figure
  ctx.save()
  ctx.translate(botX, botY)
  ctx.scale(breath, breath)

  // Ground Supply Material Stack
  ctx.fillStyle = '#64748b'
  ctx.fillRect(-20, 44, 20, 9)
  ctx.fillRect(-5, 46, 18, 7)

  // Floating ZZZ's in Sleep Mode
  if (state.phase === 'SLEEPING') {
    ctx.fillStyle = '#6666ff'
    ctx.font = 'bold 14px monospace'
    const zOffset = (t * 16) % 24
    ctx.fillText('z', isLeft ? -15 : 10, -38 - zOffset)
    ctx.fillText('Z', isLeft ? -22 : 18, -48 - zOffset)
  }

  // Articulated Arm Rotations
  let leftArmAng = 0.15
  let rightArmAng = -0.15
  let headY = 0

  if (state.phase === 'FETCHING') {
    leftArmAng = 0.75
    rightArmAng = -0.75
    headY = 2
  } else if (state.phase === 'LIFTING') {
    leftArmAng = -1.15
    rightArmAng = 1.15
    headY = -2
  } else if (state.phase === 'PLACING') {
    if (isLeft) {
      leftArmAng = -1.5
      rightArmAng = -1.0
    } else {
      leftArmAng = 1.0
      rightArmAng = 1.5
    }
    headY = -1
  } else if (state.phase === 'SNAP') {
    leftArmAng = -0.35
    rightArmAng = 0.35
    headY = -4
  } else if (state.phase === 'SLEEPING') {
    leftArmAng = 0.1
    rightArmAng = -0.1
    headY = 4
  } else if (state.phase === 'WAKING') {
    leftArmAng = -0.9
    rightArmAng = 0.9
    headY = -4
  }

  // --- Robot Chassis (Proportionally Scaled to Frame Screen Floor) ---

  // Head Chassis
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-20, -38 + headY, 40, 28)

  // Head Top Specular Bevel Line
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-17, -36 + headY, 34, 2)

  // Visor Screen Outer Bezel
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-16, -30 + headY, 32, 16)
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-14, -28 + headY, 28, 12)

  // Eyes / Sensor Iris
  if (state.phase === 'SLEEPING') {
    // Sleeping lines - -
    ctx.fillStyle = '#6666ff'
    ctx.fillRect(-11, -22 + headY, 8, 2)
    ctx.fillRect(3, -22 + headY, 8, 2)
  } else {
    const dx = Math.max(-2.5, Math.min(2.5, (mousePos.x - botX) / 60))
    const dy = Math.max(-1.8, Math.min(1.8, (mousePos.y - botY) / 60))

    // Left Eye Reticle
    ctx.fillStyle = '#00b8b0'
    ctx.beginPath()
    ctx.arc(-7 + dx, -22 + headY + dy, 3.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(-7 + dx + 0.8, -22 + headY + dy - 0.8, 1.2, 0, Math.PI * 2)
    ctx.fill()

    // Right Eye Reticle
    ctx.fillStyle = '#00b8b0'
    ctx.beginPath()
    ctx.arc(7 + dx, -22 + headY + dy, 3.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(7 + dx + 0.8, -22 + headY + dy - 0.8, 1.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Antenna Stalk & Beacon
  ctx.fillStyle = '#64748b'
  ctx.fillRect(-2, -50 + headY, 4, 12)
  ctx.fillStyle = state.phase === 'SLEEPING' ? '#6666ff' : '#00b8b0'
  ctx.beginPath()
  ctx.arc(0, -52 + headY, 4.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(1, -53 + headY, 1.5, 0, Math.PI * 2)
  ctx.fill()

  // Neck Hydraulic Joint
  ctx.fillStyle = '#475569'
  ctx.fillRect(-6, -8 + headY, 12, 4)

  // Torso Body Shell
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-18, -4, 36, 32)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-15, -2, 30, 2) // Top specular highlight

  // Torso Chest Armor Plate
  ctx.fillStyle = '#cbd5e1'
  ctx.fillRect(-14, 4, 28, 20)

  // Concentric Reactor Power Core
  ctx.fillStyle = '#0a0b16'
  ctx.beginPath()
  ctx.arc(0, 14, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#00b8b0'
  ctx.beginPath()
  ctx.arc(0, 14, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(0, 14, 2, 0, Math.PI * 2)
  ctx.fill()

  // Feet / Treaded Boots
  ctx.fillStyle = '#334155'
  ctx.fillRect(-16, 30, 13, 10)
  ctx.fillRect(3, 30, 13, 10)

  // Left Articulated Arm & Hand
  ctx.save()
  ctx.translate(-20, 2)
  ctx.rotate(leftArmAng)
  // Shoulder Ball Joint
  ctx.fillStyle = '#475569'
  ctx.beginPath()
  ctx.arc(0, 0, 4.8, 0, Math.PI * 2)
  ctx.fill()
  // Upper Arm & Piston
  ctx.fillStyle = '#64748b'
  ctx.fillRect(-3.5, 0, 7, 22)
  // Mechanical Hand Claw
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-4.5, 22, 9, 6)
  ctx.fillStyle = '#00b8b0'
  ctx.fillRect(-3, 28, 6, 3)
  ctx.restore()

  // Right Articulated Arm & Hand
  ctx.save()
  ctx.translate(20, 2)
  ctx.rotate(rightArmAng)
  // Shoulder Ball Joint
  ctx.fillStyle = '#475569'
  ctx.beginPath()
  ctx.arc(0, 0, 4.8, 0, Math.PI * 2)
  ctx.fill()
  // Upper Arm & Piston
  ctx.fillStyle = '#64748b'
  ctx.fillRect(-3.5, 0, 7, 22)
  // Mechanical Hand Claw
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-4.5, 22, 9, 6)
  ctx.fillStyle = '#00b8b0'
  ctx.fillRect(-3, 28, 6, 3)
  ctx.restore()

  ctx.restore() // End Bot
  ctx.restore() // End Side Scene
}

/**
 * Mobile-Optimized Autonomous Simulation Scene (<1024px):
 * Substantial, crisp modular builder + high-definition robot agent anchored cleanly to the bottom floor.
 * Strictly guarantees ZERO overlap with the CTA buttons while filling the lower stage with rich craft.
 */
function drawMobileScene(ctx, state, W, H, breath, t, mousePos, btnBox) {
  const groundY = H - 18
  const availableSpace = btnBox
    ? Math.max(80, groundY - btnBox.bottom - 20)
    : 160

  // Substantial block size: 26px to 32px with high dot definition
  const blockSize = Math.max(24, Math.min(32, Math.floor(availableSpace / 4.4)))
  const gap = Math.max(4, Math.floor(blockSize * 0.16))
  const totalCols = 4
  const totalWidth = totalCols * (blockSize + gap) - gap
  const ensembleWidth = totalWidth + 24 + 36 // building + gap + bot

  const buildingX = Math.floor((W - ensembleWidth) / 2)
  const botX = buildingX + totalWidth + 26
  const botY = groundY - 44

  ctx.save()

  // Technical Baseline with Measurement Ticks
  ctx.strokeStyle = '#000022'
  ctx.lineWidth = 1.6
  ctx.setLineDash([5, 3])
  ctx.beginPath()
  ctx.moveTo(buildingX - 10, groundY)
  ctx.lineTo(botX + 30, groundY)
  ctx.stroke()
  ctx.setLineDash([])

  // Technical Sub-Label
  ctx.fillStyle = '#64748b'
  ctx.font = '9px monospace'
  ctx.fillText('SYS_ALPHA // AUTONOMOUS OPERATOR', buildingX, groundY + 12)

  const columnCaps = [4, 3, 2, 1]

  // 1. Ghost Blueprint Outlines
  ctx.strokeStyle = '#c8cdd8'
  ctx.lineWidth = 1.1
  ctx.setLineDash([2, 3])
  for (let c = 0; c < totalCols; c++) {
    const bx = buildingX + c * (blockSize + gap)
    for (let r = 0; r < columnCaps[c]; r++) {
      const by = groundY - (r + 1) * (blockSize + gap)
      if (!btnBox || by >= btnBox.bottom + 16) {
        ctx.strokeRect(bx, by, blockSize, blockSize)

        // Technical corner brackets
        ctx.fillStyle = '#94a3b8'
        ctx.fillRect(bx + 1, by + 1, 2, 2)
        ctx.fillRect(bx + blockSize - 3, by + 1, 2, 2)
        ctx.fillRect(bx + 1, by + blockSize - 3, 2, 2)
        ctx.fillRect(bx + blockSize - 3, by + blockSize - 3, 2, 2)
      }
    }
  }
  ctx.setLineDash([])

  // 2. Built Solid Blocks (Architectural High-Resolution Modular Tile)
  state.blocks.forEach((block) => {
    if (block.col >= totalCols || block.row >= columnCaps[block.col]) return
    let bx = buildingX + block.col * (blockSize + gap)
    let by = groundY - (block.row + 1) * (blockSize + gap)

    // Hard collision guard: Never render a block that touches or nears the CTA buttons
    if (btnBox && by < btnBox.bottom + 16) return

    if (block.id === state.fallingBlockId) {
      by += 20
      bx += 2
    }

    // Outer structural frame (dense dark border)
    ctx.fillStyle = '#0a0b16'
    ctx.fillRect(bx, by, blockSize, blockSize)

    // Inner recessed chamber
    ctx.fillStyle = '#cbd5e1'
    ctx.fillRect(bx + 3.5, by + 3.5, blockSize - 7, blockSize - 7)

    // Specular highlight border
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(bx + 3.5, by + 3.5, blockSize - 7, 2)
    ctx.fillRect(bx + 3.5, by + 3.5, 2, blockSize - 7)

    // 4 Corner Micro-Rivets
    ctx.fillStyle = '#0a0b16'
    ctx.fillRect(bx + 5, by + 5, 2, 2)
    ctx.fillRect(bx + blockSize - 7, by + 5, 2, 2)
    ctx.fillRect(bx + 5, by + blockSize - 7, 2, 2)
    ctx.fillRect(bx + blockSize - 7, by + blockSize - 7, 2, 2)

    // Center Power Core
    if (block.isAccent) {
      ctx.fillStyle = '#0a0b16'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 5.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#00b8b0'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 3.8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 1.5, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = '#0a0b16'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 4.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#475569'
      ctx.beginPath()
      ctx.arc(bx + blockSize / 2, by + blockSize / 2, 2.8, 0, Math.PI * 2)
      ctx.fill()
    }
  })

  // 3. Active Target Blueprint Slot
  if (
    state.targetSlot &&
    state.targetSlot.col < totalCols &&
    state.targetSlot.row < columnCaps[state.targetSlot.col]
  ) {
    const tx = buildingX + state.targetSlot.col * (blockSize + gap)
    const ty = groundY - (state.targetSlot.row + 1) * (blockSize + gap)
    if (!btnBox || ty >= btnBox.bottom + 16) {
      ctx.strokeStyle = '#00b8b0'
      ctx.lineWidth = 1.8
      ctx.strokeRect(tx, ty, blockSize, blockSize)
      ctx.fillStyle = 'rgba(0, 184, 176, 0.22)'
      ctx.fillRect(tx, ty, blockSize, blockSize)
    }
  }

  // 4. Carried / Traveling Block & Tractor Beam
  if (
    state.flyingBlock &&
    state.targetSlot &&
    state.targetSlot.col < totalCols &&
    state.targetSlot.row < columnCaps[state.targetSlot.col]
  ) {
    const startX = botX - 16
    const startY = botY - 10
    const endX = buildingX + state.targetSlot.col * (blockSize + gap)
    const endY = groundY - (state.targetSlot.row + 1) * (blockSize + gap)

    if (!btnBox || endY >= btnBox.bottom + 16) {
      const p = state.flyingBlock.progress || 0
      const curX = startX + (endX - startX) * p
      const curY = startY + (endY - startY) * p - Math.sin(p * Math.PI) * 18

      // Laser guide beam
      ctx.strokeStyle = '#00b8b0'
      ctx.lineWidth = 1.4
      ctx.setLineDash([2, 2])
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(curX + blockSize / 2, curY + blockSize / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Traveling block
      ctx.fillStyle = state.flyingBlock.isAccent ? '#00b8b0' : '#0a0b16'
      ctx.fillRect(curX, curY, blockSize, blockSize)
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(curX + 3.5, curY + 3.5, blockSize - 7, blockSize - 7)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(curX + 3.5, curY + 3.5, blockSize - 7, 2)
    }
  }

  // 5. High-Definition Robot Agent Figure
  ctx.save()
  ctx.translate(botX, botY)
  ctx.scale(breath, breath)

  // Floating ZZZ's in Sleep Mode
  if (state.phase === 'SLEEPING') {
    ctx.fillStyle = '#6666ff'
    ctx.font = 'bold 12px monospace'
    const zOffset = (t * 14) % 20
    ctx.fillText('z', -12, -32 - zOffset)
    ctx.fillText('Z', -18, -42 - zOffset)
  }

  // Arm angles
  const leftArmAng =
    state.phase === 'LIFTING' ? -1.15 : state.phase === 'PLACING' ? -1.45 : 0.4
  const rightArmAng =
    state.phase === 'LIFTING' ? 1.15 : state.phase === 'PLACING' ? -0.7 : -0.4

  // Head Chassis
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-18, -34, 36, 24)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-15, -32, 30, 2) // Specular highlight

  // Visor Screen
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(-14, -26, 28, 14)
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-12, -24, 24, 10)

  // Expressive Sensor Eyes
  if (state.phase === 'SLEEPING') {
    ctx.fillStyle = '#6666ff'
    ctx.fillRect(-9, -20, 6, 2)
    ctx.fillRect(3, -20, 6, 2)
  } else {
    const dx = Math.max(-2, Math.min(2, (mousePos.x - botX) / 60))
    const dy = Math.max(-1.5, Math.min(1.5, (mousePos.y - botY) / 60))

    ctx.fillStyle = '#00b8b0'
    ctx.beginPath()
    ctx.arc(-6 + dx, -19 + dy, 2.8, 0, Math.PI * 2)
    ctx.arc(6 + dx, -19 + dy, 2.8, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(-5.3 + dx, -19.7 + dy, 1.1, 0, Math.PI * 2)
    ctx.arc(6.7 + dx, -19.7 + dy, 1.1, 0, Math.PI * 2)
    ctx.fill()
  }

  // Antenna
  ctx.fillStyle = '#64748b'
  ctx.fillRect(-2, -44, 4, 10)
  ctx.fillStyle = state.phase === 'SLEEPING' ? '#6666ff' : '#00b8b0'
  ctx.beginPath()
  ctx.arc(0, -46, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(1, -47, 1.3, 0, Math.PI * 2)
  ctx.fill()

  // Torso
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-16, -6, 32, 28)
  ctx.fillStyle = '#cbd5e1'
  ctx.fillRect(-12, 1, 24, 18)

  // Reactor Power Core
  ctx.fillStyle = '#0a0b16'
  ctx.beginPath()
  ctx.arc(0, 10, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#00b8b0'
  ctx.beginPath()
  ctx.arc(0, 10, 4.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(0, 10, 1.6, 0, Math.PI * 2)
  ctx.fill()

  // Feet / Treaded Boots
  ctx.fillStyle = '#334155'
  ctx.fillRect(-14, 22, 11, 8)
  ctx.fillRect(3, 22, 11, 8)

  // Left Arm & Claw
  ctx.save()
  ctx.translate(-16, 0)
  ctx.rotate(leftArmAng)
  ctx.fillStyle = '#64748b'
  ctx.fillRect(-3, 0, 6, 18)
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-4, 18, 8, 5)
  ctx.fillStyle = '#00b8b0'
  ctx.fillRect(-2.5, 23, 5, 2.5)
  ctx.restore()

  // Right Arm & Claw
  ctx.save()
  ctx.translate(16, 0)
  ctx.rotate(rightArmAng)
  ctx.fillStyle = '#64748b'
  ctx.fillRect(-3, 0, 6, 18)
  ctx.fillStyle = '#0a0b16'
  ctx.fillRect(-4, 18, 8, 5)
  ctx.fillStyle = '#00b8b0'
  ctx.fillRect(-2.5, 23, 5, 2.5)
  ctx.restore()

  ctx.restore() // End Bot
  ctx.restore() // End Mobile Scene
}

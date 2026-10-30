import React from 'react'
import styles from './AgentConstructionBand.module.css'

/**
 * FlatSteppedBlocks - High-Contrast Flat 2D Stepped Modular Blocks
 *
 * Clean, modern 2D vector stepped structure (stairs) with high border contrast,
 * crisp vector edges, and LyRise brand accent circuit nodes.
 *
 * @param {Object} props
 * @param {'left' | 'right'} props.side - 'left' steps down to right; 'right' steps down to left
 * @param {number} props.blockSize - Dimensions of each square block face (default: 36)
 */
export default function FlatSteppedBlocks({ side = 'left', blockSize = 36 }) {
  // Stepped column heights: Column 0 is closest to the outer screen edge, Column 3 towards the center
  const heights = [4, 3, 2, 1]
  const gap = 3.5
  const isLeft = side === 'left'

  const totalCols = heights.length
  const totalWidth = totalCols * (blockSize + gap) + 8
  const maxHeight = Math.max(...heights)
  const totalHeight = (maxHeight + 1) * (blockSize + gap) + 8

  return (
    <div className={styles.steppedBlocksWrapper}>
      <svg
        width={totalWidth}
        height={totalHeight}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className={styles.steppedBlocksSvg}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle clean flat gradient */}
          <linearGradient
            id={`flatBlockGrad_${side}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f4f9" />
          </linearGradient>

          {/* Accent block gradient (LyRise Purple / Mint) */}
          <linearGradient
            id={`flatAccentGrad_${side}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6666ff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00b8b0" stopOpacity="0.22" />
          </linearGradient>

          {/* Crisp subtle shadow for flat 2D depth */}
          <filter
            id={`flatShadow_${side}`}
            x="-10%"
            y="-10%"
            width="125%"
            height="125%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="1.5"
              floodOpacity="0.08"
              floodColor="#000022"
            />
          </filter>
        </defs>

        {/* Foundation Base Line */}
        <line
          x1={0}
          y1={totalHeight - 3}
          x2={totalWidth}
          y2={totalHeight - 3}
          stroke="rgba(0, 0, 34, 0.16)"
          strokeWidth="2"
          strokeDasharray="4 3"
        />

        {/* Render columns of blocks */}
        {heights.map((colHeight, colIndex) => {
          const visualCol = isLeft ? colIndex : totalCols - 1 - colIndex
          const x = visualCol * (blockSize + gap) + 4

          return Array.from({ length: colHeight }).map((_, rowIndex) => {
            const y = totalHeight - 5 - (rowIndex + 1) * (blockSize + gap)
            // Accent blocks
            const isAccent =
              (colIndex === 1 && rowIndex === 1) ||
              (colIndex === 0 && rowIndex === 2)

            return (
              <g
                key={`flat_block_${colIndex}_${rowIndex}`}
                filter={`url(#flatShadow_${side})`}
              >
                {/* Main Flat 2D Block */}
                <rect
                  x={x}
                  y={y}
                  width={blockSize}
                  height={blockSize}
                  rx={4.5}
                  fill={
                    isAccent
                      ? `url(#flatAccentGrad_${side})`
                      : `url(#flatBlockGrad_${side})`
                  }
                  stroke={isAccent ? '#6666ff' : 'rgba(0, 0, 34, 0.22)'}
                  strokeWidth="1.75"
                />

                {/* Top Vector Bevel Line */}
                <line
                  x1={x + 2}
                  y1={y + 2}
                  x2={x + blockSize - 2}
                  y2={y + 2}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Circuit Node on Accent Blocks */}
                {isAccent && (
                  <>
                    <circle
                      cx={x + blockSize / 2}
                      cy={y + blockSize / 2}
                      r={3}
                      fill="#00b8b0"
                    />
                    <line
                      x1={x + 4}
                      y1={y + blockSize / 2}
                      x2={x + blockSize / 2 - 4}
                      y2={y + blockSize / 2}
                      stroke="rgba(102, 102, 255, 0.4)"
                      strokeWidth="1.2"
                    />
                  </>
                )}
              </g>
            )
          })
        })}

        {/* Ghost / Target Slot where the robot places the next block */}
        {(() => {
          const targetCol = isLeft ? 2 : totalCols - 1 - 2
          const targetX = targetCol * (blockSize + gap) + 4
          const targetY = totalHeight - 5 - 3 * (blockSize + gap)

          return (
            <g className={styles.targetSlotPulse}>
              <rect
                x={targetX}
                y={targetY}
                width={blockSize}
                height={blockSize}
                rx={4.5}
                stroke="#6666ff"
                strokeWidth="1.75"
                strokeDasharray="3 3"
                fill="rgba(102, 102, 255, 0.08)"
              />
              <path
                d={`M ${targetX + blockSize / 2 - 4} ${
                  targetY + blockSize / 2
                } H ${targetX + blockSize / 2 + 4} M ${
                  targetX + blockSize / 2
                } ${targetY + blockSize / 2 - 4} V ${
                  targetY + blockSize / 2 + 4
                }`}
                stroke="#6666ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

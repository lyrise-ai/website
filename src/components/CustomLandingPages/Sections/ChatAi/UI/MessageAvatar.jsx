import React from 'react'

const MessageAvatar = React.memo(({ type }) => {
  if (!['bot', 'user'].includes(type)) return null

  return (
    <div className="flex-shrink-0">
      {type === 'bot' ? <BotAvatar /> : <UserAvatar />}
    </div>
  )
})

export default MessageAvatar

const BotAvatar = () => {
  return (
    <svg
      width={44}
      height={44}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-8 h-8 md:w-10 md:h-10"
    >
      <ellipse cx={20.8} cy={20} rx={20.8} ry={20} fill="#2957FF" />
      <g filter="url(#filter0_ddi_1881_8314)">
        <path
          d="M26.562 16.853a.357.357 0 01-.174-.04.265.265 0 01-.113-.137l-.593-1.337-1.494-.63a.272.272 0 01-.144-.107.321.321 0 01-.04-.168c0-.065.013-.12.04-.167a.272.272 0 01.144-.108l1.494-.61.593-1.277a.265.265 0 01.113-.138.357.357 0 01.174-.039c.068 0 .126.013.174.04a.265.265 0 01.112.137l.594 1.278 1.494.61a.272.272 0 01.143.107.321.321 0 01.041.168.321.321 0 01-.04.167.272.272 0 01-.144.108l-1.494.629-.594 1.337a.265.265 0 01-.112.137.357.357 0 01-.174.04zm0 11.717a.376.376 0 01-.164-.04.252.252 0 01-.123-.137l-.593-1.278-1.474-.61a.272.272 0 01-.143-.108.321.321 0 01-.041-.167.32.32 0 01.04-.167.272.272 0 01.144-.108l1.474-.61.593-1.356a.265.265 0 01.113-.138.357.357 0 01.174-.039c.068 0 .126.013.174.04a.265.265 0 01.112.137l.594 1.357 1.474.609a.272.272 0 01.143.108.32.32 0 01.04.167.321.321 0 01-.04.167.272.272 0 01-.143.108l-1.474.61-.594 1.278a.252.252 0 01-.122.137.375.375 0 01-.164.04zm-8.985-3.401a.627.627 0 01-.553-.335l-1.33-2.732-2.866-1.239a.601.601 0 01-.348-.53c0-.105.031-.207.093-.305a.601.601 0 01.255-.226l2.866-1.239 1.33-2.713a.575.575 0 01.235-.265.628.628 0 01.318-.089.628.628 0 01.552.334l1.351 2.733 2.845 1.239a.584.584 0 01.369.53.584.584 0 01-.368.53l-2.846 1.24-1.35 2.732a.52.52 0 01-.236.256.688.688 0 01-.317.079z"
          fill="url(#paint0_linear_1881_8314)"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_ddi_1881_8314"
          x={6.1137}
          y={6.5332}
          width={28.6423}
          height={29.5741}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={-1.31726} dy={2.48816} />
          <feGaussianBlur stdDeviation={2.52475} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.0506089 0 0 0 0 0.0159861 0 0 0 0 0.191833 0 0 0 0.25 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1881_8314"
          />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx={1.24408} dy={-1.1709} />
          <feGaussianBlur stdDeviation={2.19544} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.35 0" />
          <feBlend
            in2="effect1_dropShadow_1881_8314"
            result="effect2_dropShadow_1881_8314"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect2_dropShadow_1881_8314"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy={3.07361} />
          <feGaussianBlur stdDeviation={1.9393} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend in2="shape" result="effect3_innerShadow_1881_8314" />
        </filter>
        <linearGradient
          id="paint0_linear_1881_8314"
          x1={23.7091}
          y1={19.8497}
          x2={21.3178}
          y2={31.4108}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" stopOpacity={0.96} />
          <stop offset={1} stopColor="#fff" stopOpacity={0.23} />
        </linearGradient>
      </defs>
    </svg>
  )
}

const UserAvatar = () => {
  return (
    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[rgb(178,204,255)] flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 1080 1080"
        xmlSpace="preserve"
        className="w-4 h-4 md:w-5 md:h-5"
      >
        <desc>Created with Fabric.js 5.2.4</desc>
        <defs></defs>
        <g
          transform="matrix(1 0 0 1 540 540)"
          id="bc9add0d-cd6e-426a-bad7-6810fce1e32e"
        >
          <rect
            style={{
              stroke: 'none',
              strokeWidth: 1,
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeDashoffset: 0,
              strokeLinejoin: 'miter',
              strokeMiterlimit: 4,
              fill: 'rgb(255,255,255)',
              fillRule: 'nonzero',
              opacity: 1,
              visibility: 'hidden',
            }}
            vectorEffect="non-scaling-stroke"
            x="-540"
            y="-540"
            rx="0"
            ry="0"
            width="1080"
            height="1080"
          />
        </g>
        <g
          transform="matrix(1 0 0 1 540 540)"
          id="8ce28b35-eb0b-4fc7-8792-6d811159e8bc"
        ></g>
        <g transform="matrix(77.17 0 0 77.17 540 540)">
          <path
            style={{
              stroke: 'none',
              strokeWidth: 1,
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeDashoffset: 0,
              strokeLinejoin: 'miter',
              strokeMiterlimit: 4,
              fill: 'rgb(41,87,255)',
              fillRule: 'nonzero',
              opacity: 1,
            }}
            transform="translate(-48.8, -15.47)"
            d="M 48.8034 14.9983 C 47.8664 14.9983 47.0955 14.7002 46.4906 14.104 C 45.8859 13.5078 45.5835 12.7478 45.5835 11.8241 C 45.5835 10.8942 45.8859 10.1327 46.4906 9.5396 C 47.0955 8.94647 47.8664 8.6499 48.8034 8.6499 C 49.7405 8.6499 50.5114 8.94647 51.1162 9.5396 C 51.721 10.1327 52.0234 10.8942 52.0234 11.8241 C 52.0234 12.7478 51.721 13.5078 51.1162 14.104 C 50.5114 14.7002 49.7405 14.9983 48.8034 14.9983 Z M 42.6434 22.2999 C 42.3323 22.2999 42.0679 22.1926 41.8501 21.9779 C 41.6323 21.7632 41.5234 21.5025 41.5234 21.1958 L 41.5234 20.4837 C 41.5234 19.9697 41.6616 19.522 41.9378 19.1404 C 42.2141 18.7589 42.5731 18.4657 43.0149 18.2609 C 44.0366 17.8131 45.0216 17.4757 45.9698 17.2488 C 46.9181 17.0219 47.8626 16.9084 48.8034 16.9084 C 49.7442 16.9084 50.6863 17.0243 51.6296 17.2562 C 52.5729 17.488 53.5554 17.8229 54.577 18.2609 C 55.0288 18.4657 55.3928 18.7589 55.669 19.1404 C 55.9453 19.522 56.0834 19.9697 56.0834 20.4837 L 56.0834 21.1958 C 56.0834 21.5025 55.9745 21.7632 55.7568 21.9779 C 55.539 22.1926 55.2746 22.2999 54.9635 22.2999 L 42.6434 22.2999 Z"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}

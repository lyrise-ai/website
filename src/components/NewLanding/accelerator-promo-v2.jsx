import { useState, useEffect } from 'react'
import ArrowButton from '@components/Buttons/ArrowButton'
import Countdown from '@components/Accelerator/countdown'
import GiftIcon from '@assets/icons/giftIcon'
import CloseIcon from '@assets/icons/closeIcon'
import Link from 'next/link'
import Image from 'next/image'
import styles from './styles.module.css'
import bannerSrc from '@assets/top-winners-banner.png'
import { Fade, Modal } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import { Box } from '@mui/system'

const initWidth = {
  xs: '28rem',
  lg: '32rem',
}

function AcceleratorPromoV2() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 1800)
  }, [])

  if (!isOpen) return null

  const defaultStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#fff',
    border: 'none',
    outline: 'none',
    boxShadow: 24,
    borderRadius: '12px',
    overflowY: 'auto',
    background: 'transparent',
    width: '100%',
    maxWidth: {
      xs: initWidth.xs,
      lg: initWidth.lg,
    },
    padding: '24px',
    paddingInlineEnd: {
      xs: '24px',
      lg: '36px',
    },
    marginInline: 'auto',
    maxHeight: '100%',
    '&::-webkit-scrollbar': {
      width: '5px',
      height: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'gray',
      borderRadius: '10px',
    },
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      components={{ Backdrop }}
      // {...props}
    >
      <Fade in={isOpen}>
        <Box sx={{ ...defaultStyle }}>
          {/* <div
            className={`${styles.promo} fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center fade-in-out`}
          > */}
          <div className="rounded-xl border-2 border-rose-500 p-3 md:p-8 lg:p-10 space-y-3 bg-primary-25 md:space-y-8 font-primary md:flex md:flex-wrap md:justify-between relative">
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-primary font-bold leading-tight my-0">
              LyRise AI
              <br />
              Accelerator!
            </h1>

            <div className="md:w-full">
              <p className="text-neutral-500 text-lg md:text-xl font-secondary leading-6 md:leading-7">
                LyRise will offer the top upvoted startup:
                <ul className="font-bold list-disc pl-3 mt-2">
                  <li>• 2 months of AI development</li>
                  <li>• cloud storage</li>
                  <li>• 30% off future projects!</li>
                </ul>
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-2 -top-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
            >
              <CloseIcon className="h-8 w-8" />
            </button>

            <Image src={bannerSrc} alt="Top Winners Banner" />

            <div className="w-full pt-2">
              <Countdown
                timestamp={new Date(2025, 0, 1).getTime()}
                withoutWrapper
              />
            </div>

            <div className="md:w-full">
              <Link href="/accelerator" className="block">
                <ArrowButton className="mt-5 w-full h-14 md:h-16 text-xl md:text-xl !font-medium bg-rose-500 hover:bg-rose-600 transition-colors duration-300">
                  Join Lyrise AI Accelerator!
                </ArrowButton>
              </Link>
            </div>

            <Link
              className="underline text-rose-500 font-secondary text-base my-0 w-full text-center"
              href="/about-accelerator"
            >
              See how it works?
            </Link>
          </div>
          {/* </div> */}
        </Box>
      </Fade>
    </Modal>
  )
}

export default AcceleratorPromoV2

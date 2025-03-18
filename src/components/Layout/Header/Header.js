/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-target-blank */
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import * as React from 'react'
import Hamburger from '../../../assets/Hamburger.svg'
import LyRiseLogo from '../../../assets/LyRiseLogo.png'
import WhiteLyRiseLogo from '../../../assets/WhiteLyRiseLogo.svg'
import AboutIcon from '../../../assets/about.png'
import BlogIcon from '../../../assets/book-closed.png'
import Close from '../../../assets/x-close.png'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'
import ExternalLink from './ExternalLink'
import InternalLink from './InternalLink'
import { gridStyle } from './style'
import HeaderButtons from './HeaderButtons'
import Image from 'next/image'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

const list = [
  {
    id: 1,
    text: 'About',
    href: '/about',
    icon: AboutIcon,
  },
  {
    id: 2,
    text: 'Blog',
    href: 'https://blog.lyrise.ai/',
    target: '_blank',
    icon: BlogIcon,
  },
]

export default function Header() {
  const medium = useMediaQuery('(max-width:1000px)')
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (opened) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setOpen(opened)
  }

  return (
    <header className="pt-7 pb-5 px-3">
      <div className="container flex items-center justify-between gap-4 shadow-[0px_0px_4px_0px_#2957FF] py-3 px-4 rounded-[4px] ">
        <div className="w-full">
          <Link href="/">
            <Image src={WhiteLyRiseLogo} alt="logo" />
          </Link>
        </div>
        {!medium ? (
          <ul class="hidden md:flex items-center gap-4 font-space-grotesk font-normal text-[#ffffff]">
            {list.map(({ text, href, id }) => (
              <li key={id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[20px] leading-[19.2px] inline-block relative after:absolute after:start-1/2 after:-translate-x-1/2 after:bottom-[1px] after:h-[1px] after:w-full after:transition-transform after:scale-0 hover:after:scale-100 after:rounded-full after:bg-[#ffffff]"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        {medium ? (
          <>
            <Grid
              item
              sx={{
                cursor: 'pointer',
              }}
            >
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/15"
                onClick={toggleDrawer(!open)}
              >
                {open ? (
                  <CloseRoundedIcon className="text-primary" />
                ) : (
                  <MenuRoundedIcon className="text-primary" />
                )}
              </div>
              <SwipeableDrawer
                BackdropProps={{ invisible: true }}
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                sx={{
                  '& .MuiDrawer-paper': {
                    width: '100%',
                    marginTop: '16vh',
                    backgroundColor: '#20273b',
                    boxShadow: 'none',
                    height: 'calc(100vh - 16vh)',
                    paddingBottom: '10vh',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    gap: '16px',
                  }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                  className="container"
                >
                  <div className="mt-3 flex flex-col gap-2">
                    {list.map((item) => (
                      <Link
                        href={item.href}
                        target={item.target || '_self'}
                        rel="noreferrer noopener"
                        style={{
                          width: '100%',
                        }}
                      >
                        <h3 className="font-secondary font-[500] text-2xl leading-[120%] text-white">
                          {item.text}
                        </h3>
                      </Link>
                    ))}
                  </div>
                  <Grid
                    container
                    direction="column"
                    spacing={2}
                    sx={{ padding: '16px' }}
                    width={'fit-content'}
                  >
                    <HeaderButtons />
                  </Grid>
                </Box>
              </SwipeableDrawer>
            </Grid>
          </>
        ) : (
          <div className="flex justify-end w-full">
            <HeaderButtons />
          </div>
        )}
      </div>
    </header>
  )
}

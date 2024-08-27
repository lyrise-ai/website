/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-target-blank */
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import Grid from '@mui/material/Grid'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import * as React from 'react'
import Hamburger from '../../../assets/Hamburger.svg'
import LyRiseLogo from '../../../assets/LyRiseLogo.png'
import AboutIcon from '../../../assets/about.png'
import BlogIcon from '../../../assets/book-closed.png'
import Close from '../../../assets/x-close.png'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'
import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'
import ExternalLink from './ExternalLink'
import InternalLink from './InternalLink'
import { gridStyle } from './style'
import HeaderButtons from './HeaderButtons'

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
  // {
  //   text: 'Product',
  //   href: '/product',
  //   icon: CaseStudiesIcon,
  // },
]

export default function Header({ isTalent }) {
  const { pathname, asPath } = useRouter()
  const medium = useMediaQuery('(max-width:1000px)')
  const employerPathname = '/Employer'
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
    <div style={{ backgroundColor: '#FFF' }}>
      <div
        className={pathname !== employerPathname ? 'container' : undefined}
        style={{
          ...(pathname === employerPathname && {
            width: '90%',
            minHeight: '80px',
            margin: '0 auto',
            display: 'flex',
          }),
        }}
      >
        <Grid
          container
          direction="row"
          wrap="nowrap"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            gridStyle,
            // padding: medium ? '30px 20px 20px 20px' : '8px 0px',
            padding: '8px 0',
          }}
        >
          <Grid
            item
            container
            xs={medium ? 6 : 3} // 6 columns for mobile, 2 for desktop
            wrap="nowrap"
            gap="20px"
            alignItems="center"
          >
            <Grid
              item
              sx={{
                marginTop: '9px',
              }}
            >
              <Link href="/">
                <a>
                  <Image
                    src={LyRiseLogo}
                    width={120}
                    height={40}
                    objectFit="contain"
                  />
                </a>
              </Link>
            </Grid>
          </Grid>
          {!medium ? (
            <Grid
              item
              container
              wrap="nowrap"
              gap="40px"
              justifyContent={'start'}
            >
              <Grid item>
                <InternalLink
                  text="About"
                  link="/about"
                  active={asPath === '/about'}
                />
              </Grid>
              <Grid item>
                <ExternalLink text="Blog" link="https://blog.lyrise.ai/" />
              </Grid>
            </Grid>
          ) : null}
          {medium ? (
            <>
              <Grid
                item
                sx={{
                  cursor: 'pointer',
                }}
              >
                <Image
                  src={open ? Close : Hamburger}
                  onClick={toggleDrawer(!open)}
                  alt="menu"
                />
                <SwipeableDrawer
                  BackdropProps={{ invisible: true }}
                  anchor="right"
                  open={open}
                  onClose={toggleDrawer(false)}
                  onOpen={toggleDrawer(true)}
                  sx={{
                    '& .MuiDrawer-paper': {
                      width: '100%',
                      marginTop: "9vh",
                      backgroundColor: 'white',
                      boxShadow: 'none',
                      paddingBottom: '10vh',
                    },
                  }}
                >
                  <Divider
                    sx={{
                      backgroundImage:
                        'linear-gradient(180deg, #000000 0%, #D1DBFF 0.01%, #737CFE 100%)',
                      height: '1px',
                      width: '100%',
                    }}
                  />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                  >
                    <List>
                      {list.map((item) => (
                        <ListItem key={item.id} >
                          <Link href={item.href}>
                            <a
                              target={item.target || '_self'}
                              rel="noreferrer noopener"
                              style={{
                                width: '100%',
                              }}
                            >
                              <ListItemButton
                                sx={{
                                  color: '#000000',
                                  width: '100%',
                                  '&:hover, &:focus': {
                                    backgroundColor: '#red',
                                  },
                                }}
                              >
                                {/* <ListItemIcon>
                                  <Image src={item.icon} />
                                </ListItemIcon> */}
                                <ListItemText
                                  primary={item.text}
                                  primaryTypographyProps={{
                                    sx: {
                                      fontFamily: 'Poppins, sans-serif',
                                      fontStyle: 'normal',
                                      fontWeight: 500,
                                      fontSize: '1.5rem',
                                      lineHeight: '120%',
                                    }
                                  }}
                                  className='text-neutral-500'
                                />
                              </ListItemButton>
                            </a>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                    <Grid
                      container
                      direction="column"
                      spacing={2}
                      sx={{ padding: '16px' }}
                    >
                      <HeaderButtons />
                    </Grid>
                  </Box>
                </SwipeableDrawer>
              </Grid>
            </>
          ) : (
            <Grid item container>
              <Grid
                item
                container
                alignItems="center"
                justifyContent="flex-end"
                direction={"row"}
                wrap='nowrap'
                gap={3}
              >
                <HeaderButtons />
              </Grid>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  )
}

Header.propTypes = {
  isTalent: PropTypes.bool,
}

Header.defaultProps = {
  isTalent: false,
}

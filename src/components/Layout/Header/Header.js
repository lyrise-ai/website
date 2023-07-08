/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/jsx-no-target-blank */
import * as React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import Grid from '@mui/material/Grid'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import LyRiseLogo from '../../../assets/LyRiseLogo.png'
import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'
import Hamburger from '../../../assets/Hamburger.svg'
import BlogIcon from '../../../assets/book-closed.png'
import Close from '../../../assets/x-close.png'
// import CaseStudiesIcon from '../../../assets/CaseStudy.png'
import { gridStyle } from './style'
import InternalLink from './InternalLink'
import ExternalLink from './ExternalLink'

const list = [
  {
    id: 1,
    text: 'Blog',
    href: 'https://blog.lyrise.ai/',
    icon: BlogIcon,
  },
  // {
  //   id: 2,
  //   text: 'About',
  //   href: '/about',
  //   // icon: BlogIcon,
  // },
  // {
  //   text: 'Case Studies',
  //   href: '#',
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
            xs={6}
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
                  <Image src={LyRiseLogo} />
                </a>
              </Link>
            </Grid>
            {!medium ? (
              <Grid item container wrap="nowrap" gap="20px">
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
                <Grid item>
                  <InternalLink
                    text="Product"
                    link="/product"
                    active={asPath === '/product'}
                  />
                </Grid>
              </Grid>
            ) : null}
          </Grid>
          {medium && pathname !== employerPathname ? (
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
                      marginTop: '100px',
                      backgroundColor: '#E2E2E2',
                    },
                  }}
                >
                  <Divider
                    sx={{
                      backgroundImage:
                        'linear-gradient(180deg, #000000 0%, #094BF6 0.01%, #737CFE 100%)',
                      height: '2px',
                      width: '100%',
                    }}
                  />
                  <Box
                    sx={{
                      width: '100%',
                    }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                  >
                    <List>
                      {list.map((item) => (
                        <ListItem key={item.id}>
                          <Link href={item.href}>
                            <a
                              target="_blank"
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
                                <ListItemIcon>
                                  <Image src={item.icon} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={item.text}
                                  sx={{
                                    fontFamily: 'Poppins',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '14px',
                                    lineHeight: '140%',
                                    color: '#344054',
                                  }}
                                />
                              </ListItemButton>
                            </a>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </SwipeableDrawer>
              </Grid>
            </>
          ) : (
            <Grid item xs={6} container>
              {pathname !== employerPathname ? (
                <Grid
                  item
                  container
                  alignItems="center"
                  justifyContent="flex-end"
                  gap={3}
                >
                  {pathname !== employerPathname ? (
                    <>
                      <Grid item>
                        <InternalLink
                          text={isTalent ? 'Start Hiring' : 'Apply for jobs'}
                          link={isTalent ? '/' : '/talents'}
                          section="HeaderSection"
                          eventName={
                            isTalent
                              ? 'PressedStartHiring'
                              : 'PressedApplyForJobs'
                          }
                          isTalent
                        />
                      </Grid>
                      <Grid item>
                        <ScheduleMeetingButton
                          white
                          location="HeaderSection"
                          isTalent={isTalent}
                          link={
                            isTalent
                              ? 'https://talents.lyrise.ai/'
                              : '/Employer'
                          }
                          text={isTalent ? 'Apply Now' : undefined}
                          eventType={
                            isTalent
                              ? 'PressedApplyNow'
                              : 'PressedScheduleAMeeting'
                          }
                          isPopup={false}
                          // isPopup={pathname === '/'}
                        />
                      </Grid>
                    </>
                  ) : null}
                </Grid>
              ) : null}
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

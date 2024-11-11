/* eslint-disable sonarjs/cognitive-complexity */
import * as React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Button, useMediaQuery, Typography, Grid } from '@mui/material'
import Image from "next/legacy/image"
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import Link from 'next/link'
import { WhiteButton, PurpleButton } from './styles'
import PurpleRightArrow from '../../assets/PurpleRightArrow.svg'
import WhiteRightArrow from '../../assets/WhiteRightArrow.svg'
import FormPopup from '../shared/FormPopup/FormPopup'

export default function ScheduleMeetingButton({
  white,
  text,
  link,
  location,
  eventType,
  isPopup,
  isTalent,
}) {
  const { pathname } = useRouter()
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const smallScreen = useMediaQuery('(max-width: 300px)')
  const [isHovered, setIsHovered] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const onClickHandler = () => {
    if (process.env.NEXT_PUBLIC_ENV === 'production') {
      const eventProperties = {
        section: location,
        page: pathname,
      }
      amplitude.getInstance().logEvent(eventType, eventProperties)
      ReactGA.event({
        category: `${
          isTalent ? 'TalentLandingPage' : 'MainLandingPage'
        }-${location}`,
        action: eventType,
      })
    }
  }

  return (<>
    <FormPopup open={open} handleClose={handleClose} location={location} />
    {link ? (
      <Link href={link} passHref legacyBehavior>
        <Button
          disableElevation
          variant={white ? 'outlined' : 'contained'}
          sx={{
            ...(white ? WhiteButton : PurpleButton),
            width: smallScreen ? '100% !important' : '16.875rem',
            textAlign: mobile && 'center',
          }}
          onClick={onClickHandler}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          // href={isPopup ? undefined : link}
          // target={isPopup ? undefined : '_blank'}
          // rel={isPopup ? undefined : 'noopener noreferrer'}
        >
          <Grid
            container
            direction="row"
            alignItems="center"
            gap={2}
            justifyContent={mobile ? 'space-around' : 'center'}
          >
            <Grid item>
              <Typography
                color={white ? 'primary' : '#FFF'}
                fontSize="1.3rem"
                className="font-secondary"
                fontWeight={500}
              >
                {(pathname === '/' || pathname === '/about') &&
                [
                  // eslint-disable-next-line sonarjs/no-duplicate-string
                  'Schedule a meeting',
                  'Start Hiring',
                  'Hire a Talent',
                ].includes(text)
                  ? 'Hire Vetted Talent'
                  : text}
              </Typography>
            </Grid>
            <Grid item>
              <Image src={white ? PurpleRightArrow : WhiteRightArrow} />
            </Grid>
          </Grid>
        </Button>
      </Link>
    ) : (
      <Button
        disableElevation
        variant={white ? 'outlined' : 'contained'}
        sx={{
          ...(white ? WhiteButton : PurpleButton),
          width: smallScreen ? '100% !important' : '16.875rem',
          textAlign: mobile && 'center',
        }}
        onClick={onClickHandler}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        href={isPopup ? undefined : link}
        target={isPopup ? undefined : '_blank'}
        rel={isPopup ? undefined : 'noopener noreferrer'}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          gap={2}
          justifyContent={mobile ? 'space-around' : 'center'}
        >
          <Grid item>
            <Typography color={white ? 'primary' : '#FFF'} fontSize="1.3rem">
              {pathname === '/' &&
              [
                'Schedule a meeting',
                'Start Hiring',
                'Hire a Talent',
              ].includes(text)
                ? 'Hire Vetted Talent'
                : text}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              transform: isHovered ? 'scaleX(1.3)' : undefined,
            }}
          >
            <Image
              src={white ? PurpleRightArrow : WhiteRightArrow}
              width="100"
              height="100"
            />
          </Grid>
        </Grid>
      </Button>
    )}
  </>);
}

ScheduleMeetingButton.propTypes = {
  white: PropTypes.bool,
  text: PropTypes.string,
  link: PropTypes.string,
  location: PropTypes.string.isRequired,
  eventType: PropTypes.string,
  isPopup: PropTypes.bool,
  isTalent: PropTypes.bool.isRequired,
}

ScheduleMeetingButton.defaultProps = {
  white: false,
  text: 'Schedule a meeting',
  link: '/Employer',
  eventType: 'PressedScheduleAMeeting',
  isPopup: false,
}

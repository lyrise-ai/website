/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Typography } from '@mui/material'
import Link from 'next/link'
import PropTypes from 'prop-types'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'

const InternalLink = ({ text, link, section, eventName, active, isTalent }) => {
  const { pathname } = useRouter()
  const onClickHandler = () => {
    if (
      process.env.NEXT_PUBLIC_ENV === 'production' &&
      text === 'Start Hiring' &&
      isTalent
    ) {
      const eventProperties = {
        section,
        page: pathname,
      }

      amplitude.getInstance().logEvent(eventName, eventProperties)

      ReactGA.event({
        category: `${
          isTalent ? 'TalentLandingPage' : 'MainLandingPage'
        }-${section}`,
        action: eventName,
      })
    }
    if (
      process.env.NEXT_PUBLIC_ENV === 'production' &&
      text === 'Apply for jobs' &&
      !isTalent
    ) {
      const eventProperties = {
        section,
        page: pathname,
      }

      amplitude.getInstance().logEvent(eventName, eventProperties)

      ReactGA.event({
        category: `MainLandingPage-${section}`,
        action: eventName,
      })
    }
  }
  return (
    <Link href={link} passHref>
      <a onClick={onClickHandler}>
        <Typography
          color="#7B7B98"
          className={active ? 'active' : ''}
          sx={{
            fontFamily: 'Cairo',
            fontSize: '20px',
            fontWeight: '500',
            lineHeight: '24px',
            letterSpacing: '-0.006em',
            textAlign: 'left',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {text}
        </Typography>
      </a>
    </Link>
  )
}

InternalLink.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  section: PropTypes.string,
  eventName: PropTypes.string,
  isTalent: PropTypes.bool,
  active: PropTypes.bool,
}

InternalLink.defaultProps = {
  active: false,
  section: null,
  eventName: '',
  isTalent: false,
}
export default InternalLink

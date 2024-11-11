import { Typography } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
// import { useRouter } from 'next/router'
import useMediaQuery from '@mui/material/useMediaQuery'
import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'
// import { FirebaseConsumer } from '../../../context/FirebaseContext'
// import SignupForm from '../../HeroSection/SignUpForm/SignUpForm'

const GetInTouch = ({ Filter, BoxShadow, isTalent }) => {
  // const { pathname } = useRouter()
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const aboveMobile = useMediaQuery((theme) => theme.breakpoints.up('sm'))
  const mid = useMediaQuery('(max-width:1000px)')

  return (
    // <FirebaseConsumer>
    //   {(isPopup) => {
    //     return (
    //     )
    //   }}
    // </FirebaseConsumer>
    (<div
      style={{
        width: aboveMobile ? '26.25rem' : '100%',
        padding: mobile ? '10px' : '20px',
        borderRadius: '8px',
        background: '#F9FAFC',
        filter: Filter,
        boxShadow: BoxShadow,
        display: 'flex',
        flexDirection: 'column',
        alignItems: mid ? 'center' : undefined,
        justifyContent: mid ? 'center' : undefined,
      }}
    >
      <Typography
        marginBottom={2.5}
        style={{ textAlign: mobile ? 'center' : 'left' }}
      >
        {isTalent ? 'Let us get in touch.' : 'Start your hiring process now'}
      </Typography>
      <ScheduleMeetingButton
        location="HeroSection"
        link={isTalent ? 'https://talents.lyrise.ai/' : '/Employer'}
        text={isTalent ? 'Apply Now' : 'Hire a Talent'}
        eventType={isTalent ? 'PressedApplyNow' : undefined}
        isTalent={isTalent}
        isPopup={false}
        // isPopup={pathname === '/'}
      />
    </div>)
  );
}

GetInTouch.propTypes = {
  Filter: PropTypes.string,
  BoxShadow: PropTypes.string,
  isTalent: PropTypes.bool,
}

GetInTouch.defaultProps = {
  Filter: 'drop-shadow(0px 2px 12px #00000014)',
  BoxShadow: '2px 5px 20px 1px #65509C14',
  isTalent: false,
}
export default GetInTouch

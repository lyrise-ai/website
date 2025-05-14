// import PropTypes from 'prop-types'
import { Grid, Typography, useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import PrimaryButton from '../shared/PrimaryButton/PrimaryButton'
import SecondaryButton from '../shared/SecondaryButton/SecondaryButton'
import { useFormData } from './FormContext/FormContext'
import { useEffect } from 'react'

export default function FormThree() {
  const under678 = useMediaQuery('(max-width: 678px)')
  const under500 = useMediaQuery('(max-width: 500px)')
  const router = useRouter()
  const { formOne } = useFormData()

  // useEffect(() => {

  // },[])

  return (
    <Grid
      item
      container
      justifyContent="center"
      minHeight="calc(100vh - 400px)"
    >
      <Grid item container direction="column" justifyContent="center" gap={0.8}>
        <Grid item>
          <b
            xs={{
              fontSize: under678 ? '24px' : '32px',
              fontFamily: 'Poppins',
              fontStyle: 'bold',
              lineHeight: '28px',
            }}
          >
            Thank You, {formOne?.name}!
          </b>
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: under678 ? '16px' : '22px' }}>
            We will reach out to you promptly to get started on filling the
            hiring needs you have.
          </Typography>
          <Typography sx={{ fontSize: under678 ? '16px' : '22px' }}>
            If you would like to schedule a particular date and time for a chat,
            tell us right here.
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction={under500 ? 'column' : 'row'}
          alignItems={under500 ? 'center' : 'flex-start'}
          justifyContent={under678 ? 'center' : 'flex-start'}
          maxWidth="640px !important"
          gap={under678 ? 2 : undefined}
          mt="48px"
        >
          <Grid item mr={!under678 ? '14px' : undefined}>
            <PrimaryButton
              text="Schedule a meeting"
              onClickHandler={() => {
                const eventProperties = {
                  section: 'employer-survey',
                  page: router.pathname,
                }
                if (process.env.NEXT_PUBLIC_ENV === 'production') {
                  amplitude
                    .getInstance()
                    .logEvent('PressedScheduleAMeeting', eventProperties)
                  ReactGA.event({
                    category: 'EmployerSignupViewThree',
                    action: 'PressedScheduleAMeeting',
                  })
                }
                router.replace('/calendar')
              }}
            />
          </Grid>
          <Grid item>
            <SecondaryButton
              styles={{ whiteSpace: 'nowrap' }}
              text="Go to home"
              onClickHandler={() => {
                const eventProperties = {
                  section: 'employer-survey',
                  page: router.pathname,
                }
                if (process.env.NEXT_PUBLIC_ENV === 'production') {
                  amplitude
                    .getInstance()
                    .logEvent('PressedGoToHome', eventProperties)
                  ReactGA.event({
                    category: 'EmployerSignupViewThree',
                    action: 'PressedGoToHome',
                  })
                }
                router.replace('/')
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
FormThree.propTypes = {}

FormThree.defaultProps = {}

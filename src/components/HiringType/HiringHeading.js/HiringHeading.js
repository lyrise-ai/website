import { Grid, useMediaQuery } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
import SubTitle from '../../shared/SubTitle/SubTitle'
import Title from '../../shared/Title/Title'

const HiringHeading = ({ title, subtitle }) => {
  const sm = useMediaQuery('(max-width:600px)')
  return (
    <Grid
      container
      justifyContent="center"
      direction="column"
      alignItems={sm ? 'flex-start' : 'center'}
    >
      <Grid item>
        <Title
          width="409px"
          style={{ marginBottom: '12px' }}
          textAlign={sm ? 'left' : 'center'}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </Grid>
      <Grid item style={{ marginBottom: '25px' }}>
        <SubTitle>{subtitle}</SubTitle>
      </Grid>
    </Grid>
  )
}

HiringHeading.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
}

HiringHeading.defaultProps = {
  title: 'Which type of hiring <br />do you need?',
  subtitle: 'Choose the plan the works best for you',
}

export default HiringHeading

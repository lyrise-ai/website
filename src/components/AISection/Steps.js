import React from 'react'
import PropTypes from 'prop-types'
import { Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import styles from './steps.module.css'

const Steps = ({ steps }) => {
  const mobile = useMediaQuery('(max-width: 1000px)')

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="flex-start"
      spacing={4}
    >
      {steps.map((step) => (
        <Grid item container direction="column" key={step}>
          <Grid item mb="20px">
            <Divider />
          </Grid>
          <Grid item ml={5}>
            <Typography
              className={mobile ? styles.steps__mobile : styles.steps}
            >
              {step}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}

export default Steps

Steps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
}

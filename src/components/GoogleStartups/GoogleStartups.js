import { Grid, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import GoogleImg from '../../assets/Google.svg'

const GoogleStartups = () => {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('md'))

  return (
    <div className="container">
      <Grid
        container
        direction={mobile ? 'column' : 'row'}
        justifyContent={mobile ? 'flex-start' : 'center'}
        alignItems="center"
        gap={mobile ? 2 : undefined}
        sx={{
          width: '85%',
          margin: 'auto',
        }}
      >
        <Grid item xs={4} style={{ paddingRight: '35px' }}>
          <Image src={GoogleImg} alt="Google" />
        </Grid>
        <Grid
          item
          xs={6}
          alignSelf="center"
          sx={{
            paddingLeft: mobile ? '0' : '35px',
            maxWidth: mobile ? 'min(335px, 100%)' : undefined,
          }}
        >
          <Typography>
            In 2022, LyRise is participating in Google for Startups Accelerator
            Africa Class 7!
          </Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default GoogleStartups

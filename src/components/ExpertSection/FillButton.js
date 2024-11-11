import * as React from 'react'
import PropTypes from 'prop-types'
import { Button, Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import { fillButtonStyle } from './style'

export default function FillButton({ img, txt }) {
  const extraSmall = useMediaQuery('(max-width: 300px)')
  return (
    <>
      <Divider />
      <Button disableRipple sx={fillButtonStyle}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid
            item
            xs={1}
            display={extraSmall && 'none'}
            container
            justifyContent="flex-start"
          >
            <Image src={img} />
          </Grid>
          <Grid item>
            <Typography fontSize={extraSmall && '16px'}>{txt}</Typography>
          </Grid>
        </Grid>
      </Button>
    </>
  )
}

FillButton.propTypes = {
  img: PropTypes.any.isRequired,
  txt: PropTypes.string.isRequired,
}

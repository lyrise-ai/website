import { Button, Grid, Typography, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const PrimaryButton = ({ onClickHandler, text, type, styles = {} }) => {
  const under451 = useMediaQuery('(max-width: 451px)')

  return (
    <Grid item xs={under451 ? 10 : undefined}>
      <Button
        type={type}
        // disabled={!isValid}
        // disabled={checkDisabled()}
        sx={{
          background: '#2957FF',
          borderRadius: '8px',
          width: under451 ? '240px' : '200px',
          padding: '14px 40px',
          whiteSpace: 'nowrap',
          height: '52px',
          boxShadow: '13px 21px 34px 2px rgba(66, 0, 255, 0.1)',
          ...styles,
          '&:disabled': {
            background: 'grey !important',
          },
          '&:hover': {
            background: '#4369F7 !important',
          },
        }}
        onClick={onClickHandler}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: '500',
            fontSize: '16px',
            lineHeight: '22.4px',
            color: '#F8FAFC',
            textTransform: 'none',
          }}
        >
          {text}
        </Typography>
      </Button>
    </Grid>
  )
}

PrimaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func,
  styles: PropTypes.object,
}

PrimaryButton.defaultProps = {
  onClickHandler: () => {},
  styles: {},
}

export default PrimaryButton

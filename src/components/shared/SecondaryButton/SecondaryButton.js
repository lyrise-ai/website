import { Button, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'

const SecondaryButton = ({
  onClickHandler,
  text,
  type = 'text',
  styles = {},
}) => {
  const under451 = useMediaQuery('(max-width: 451px)')

  return (
    <Button
      type={type}
      onClick={onClickHandler}
      sx={{
        background: 'white !important',
        borderRadius: '8px',
        ...styles,
        width: under451 ? '240px' : '175px',

        // height: '52px',
        padding: '14px 40px',
        borderColor:
          'linear-gradient(98.63deg, #094BF6 25.85%, #737CFE 103.34%)',
        border: '2px solid',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '500',
          fontSize: '16px',
          lineHeight: '22.4px',
          textTransform: 'none',
          background:
            'linear-gradient(98.63deg, #094BF6 25.85%, #737CFE 103.34%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </Typography>
    </Button>
  )
}

SecondaryButton.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func,
  styles: PropTypes.object,
}

SecondaryButton.defaultProps = {
  onClickHandler: () => {},
  styles: {},
}

export default SecondaryButton

import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'

const SecondaryText = ({ text, styles }) => {
  return (
    <Typography
      sx={{
        fontWeight: '400',
        fontSize: '20px',
        lineHeight: '145%',
        color: '#7B7B98',
        ...(Object.keys(styles).length > 0 && styles),
      }}
    >
      {text}
    </Typography>
  )
}

SecondaryText.propTypes = {
  text: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
}

export default SecondaryText

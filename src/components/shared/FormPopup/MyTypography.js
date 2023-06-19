import React from 'react'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import styles from './FormPopup.module.css'

export default function MyTypography({ children }) {
  return <Typography className={styles.form__label}>{children}</Typography>
}

MyTypography.propTypes = {
  children: PropTypes.string.isRequired,
}

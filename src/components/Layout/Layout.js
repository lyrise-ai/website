/* eslint-disable react/no-array-index-key */
import React from 'react'
import Grid from '@mui/material/Grid'
import PropTypes from 'prop-types'
import Footer from './Footer/Footer'
import Header from './Header/Header'

const Layout = ({ children, isTalent, isRaw = false }) => {
  if (isRaw)
    return (
      <>
        <Header isTalent={isTalent} />
        {children}
        <Footer isTalent={isTalent} />
      </>
    )
  return (
    <div style={{ overflow: 'hidden' }}>
      <Header isTalent={isTalent} />
      <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
        {children.map((child, index) => (
          <Grid
            item
            xs={12}
            key={`${index}-id`}
            className={
              index === children.length - 1 || index === 0
                ? undefined
                : 'section-padding'
            }
          >
            {child}
          </Grid>
        ))}
      </Grid>
      <Footer isTalent={isTalent} />
    </div>
  )
}

export default Layout

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  isTalent: PropTypes.bool,
}

Layout.defaultProps = {
  isTalent: false,
}

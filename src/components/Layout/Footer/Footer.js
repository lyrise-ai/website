import React from 'react'
import PropTypes from 'prop-types'
import { useMediaQuery } from '@mui/material'
import FooterMobileV2 from './FooterMobileV2'
import FooterMainV2 from './FooterMainV2'

const Footer = ({ isTalent }) => {
  const mobile = useMediaQuery('(max-width: 887px)')
  return (
    <>
      {mobile ? (
        <FooterMobileV2 isTalent={isTalent} />
      ) : (
        <FooterMainV2 isTalent={isTalent} />
      )}
    </>
  )
  // return null
}

export default Footer

Footer.propTypes = {
  isTalent: PropTypes.bool,
}

Footer.defaultProps = {
  isTalent: false,
}

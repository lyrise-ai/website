import React from 'react'
import PropTypes from 'prop-types'
import { useMediaQuery } from '@mui/material'
import FooterMobile from './FooterMobile'
import FooterMain from './FooterMain'

const Footer = ({ isTalent }) => {
  const mobile = useMediaQuery('(max-width: 887px)')
  // return (
  //   <>
  //     {mobile ? (
  //       <FooterMobile isTalent={isTalent} />
  //     ) : (
  //       <FooterMain isTalent={isTalent} />
  //     )}
  //   </>
  // )
  return null
}

export default Footer

Footer.propTypes = {
  isTalent: PropTypes.bool,
}

Footer.defaultProps = {
  isTalent: false,
}

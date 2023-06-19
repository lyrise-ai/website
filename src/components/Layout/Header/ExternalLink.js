import { Typography } from '@mui/material'
import PropTypes from 'prop-types'

const ExternalLink = ({ text, link, active }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <Typography
        color="#7B7B98"
        className={active ? 'active' : ''}
        sx={{
          fontFamily: 'Cairo',
          fontSize: '20px',
          fontWeight: '500',
          lineHeight: '24px',
          letterSpacing: '-0.006em',
          textAlign: 'left',
          cursor: 'pointer',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        {text}
      </Typography>
    </a>
  )
}

ExternalLink.propTypes = {
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  active: PropTypes.bool,
}

ExternalLink.defaultProps = {
  active: false,
}

export default ExternalLink

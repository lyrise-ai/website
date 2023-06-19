import PropTypes from 'prop-types'

export default function ErrorMessage({ message }) {
  return <p style={{ fontSize: '14px', color: '#770000' }}>{message}</p>
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
}

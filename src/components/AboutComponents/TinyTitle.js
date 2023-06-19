import PropTypes from 'prop-types'

const TinyTitle = ({ text, otherStyles }) => {
  return (
    <p
      style={{
        textAlign: 'center',
        color: '#2957FF',
        fontSize: '20px',
        fontWeight: '700',
        lineHeight: '24px',
        ...otherStyles,
      }}
    >
      {text}
    </p>
  )
}

TinyTitle.propTypes = {
  text: PropTypes.string.isRequired,
  otherStyles: PropTypes.object,
}

TinyTitle.defaultProps = {
  otherStyles: {},
}

export default TinyTitle

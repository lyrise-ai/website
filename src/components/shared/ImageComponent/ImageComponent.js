import Image from 'next/legacy/image'
import PropTypes from 'prop-types'
import React from 'react'

export const ImgComponent = ({
  source,
  alt,
  width = '100%',
  height = '100%',
  styles,
  onClick,
  fit = 'contain',
  priority = false,
}) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    style={{ width, height, display: 'block', position: 'relative', ...styles }}
    onClick={onClick}
  >
    <Image
      src={source}
      alt={alt}
      layout="fill"
      placeholder="blur"
      blurDataURL="https://abstackwp.khingars.com/wp-content/uploads/2021/09/image-blur-placeholder.png"
      loading="lazy"
      priority={priority}
      objectPosition="center"
      objectFit={fit}
      width={100}
      height={100}
      style={{ objectFit: 'contain' }}
    />
  </div>
)

ImgComponent.propTypes = {
  source: PropTypes.any.isRequired,
  alt: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  styles: PropTypes.object,
  onClick: PropTypes.func,
  fit: PropTypes.string,
  priority: PropTypes.bool,
}

ImgComponent.defaultProps = {
  styles: {},
  fit: 'contain',
  priority: false,
  onClick: () => {},
  width: '100%',
  height: '100%',
  alt: 'image',
}

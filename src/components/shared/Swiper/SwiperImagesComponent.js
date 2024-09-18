import PropTypes from 'prop-types'
import { useState } from 'react'
import { useMediaQuery } from '@mui/material'

import SwiperComponent from './SwiperComponent'
import { ImgComponent } from '../ImageComponent/ImageComponent'

const SwiperImagesComponent = ({ images }) => {
  const [selected, setSelected] = useState(null)
  const under600 = useMediaQuery('(max-width: 600px)')

  const items = images.map((imgObj) => ({
    id: imgObj.id,
    content: (
      <ImgComponent
        source={imgObj.id === selected ? imgObj.image : imgObj.greyImage}
        width={under600 ? '100px' : '150px'}
        height="93px"
      />
    ),
  }))

  return (
    <SwiperComponent
      items={items}
      selected={selected}
      setSelected={setSelected}
    />
  )
}

SwiperImagesComponent.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      greyImage: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default SwiperImagesComponent

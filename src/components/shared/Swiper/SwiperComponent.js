/* eslint-disable import/no-unresolved */
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Autoplay } from 'swiper'
import PropTypes from 'prop-types'
import { useMediaQuery } from '@mui/material'
import 'swiper/css'
import { ImgComponent } from '../ImageComponent/ImageComponent'

const SwiperComponent = ({ images }) => {
  const [selected, setSelected] = React.useState(null)
  const above1000 = useMediaQuery('(min-width: 1000px)')
  const under600 = useMediaQuery('(max-width: 600px)')
  const under400 = useMediaQuery('(max-width: 400px)')

  return (
    <Swiper
      freeMode
      autoHeight
      grabCursor
      modules={[FreeMode, Autoplay]}
      className="mySwiper"
      slidesPerView={under400 ? 2 : above1000 ? 5 : 3}
      spaceBetween={10}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
      {images.map((imgObj) => (
        <SwiperSlide
          key={imgObj.id}
          onMouseEnter={() => setSelected(imgObj.id)}
          onMouseOut={() => setSelected(null)}
        >
          <ImgComponent
            source={imgObj.id === selected ? imgObj.image : imgObj.greyImage}
            width={under600 ? '100px' : '150px'}
            height="93px"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

SwiperComponent.propTypes = {
  images: PropTypes.array.isRequired,
}

export default SwiperComponent

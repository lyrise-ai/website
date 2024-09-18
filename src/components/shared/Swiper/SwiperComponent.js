/* eslint-disable import/no-unresolved */
import PropTypes from 'prop-types'
import { useMediaQuery } from '@mui/material'

import 'swiper/css'
import { Autoplay, FreeMode } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

const SwiperComponent = ({ items, selected, setSelected }) => {
  const above1000 = useMediaQuery('(min-width: 1000px)')
  const under400 = useMediaQuery('(max-width: 400px)')

  return (
    <Swiper
      freeMode
      autoHeight
      grabCursor
      loop
      modules={[FreeMode, Autoplay]}
      className="mySwiper"
      slidesPerView={under400 ? 2 : above1000 ? 5 : 3}
      spaceBetween={10}
      autoplay={{
        stopOnLastSlide: false,
        delay: 2500,
        disableOnInteraction: false,
      }}
    >
      {items.map((item) => (
        <SwiperSlide
          key={item.id}
          onMouseEnter={() => setSelected(item.id)}
          onMouseOut={() => setSelected(null)}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: item.id === selected ? 1 : 0.5,
              transition: 'opacity 0.3s ease',
            }}
          >
            {item.content}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

SwiperComponent.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelected: PropTypes.func,
}

export default SwiperComponent

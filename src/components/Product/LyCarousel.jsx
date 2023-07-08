import React from 'react'
import { Carousel } from '@material-tailwind/react'
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
} from 'react-icons/md'

export default function LyCarousel({ children }) {
  return (
    <Carousel
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-5 md:bottom-[10%] left-1/2 md:left-[20%] lg:left-[15%] xl:left-[12%] z-50 flex -translate-x-2/4 gap-4">
          {new Array(length).fill('').map((_, i) => (
            <button
              type="button"
              key={_.props.id}
              className={`block h-3 w-3 cursor-pointer rounded-full transition-all content-[''] ${
                activeIndex === i ? 'bg-black' : 'bg-black/50'
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
      prevArrow={({ handlePrev }) => <Arrow onClick={handlePrev} />}
      nextArrow={({ handleNext }) => <Arrow onClick={handleNext} isRight />}
      className="m-auto rounded-xl h-auto md:h-[75vh] w-full overflow-hidden md:bg-white"
      loop
    >
      {children}
    </Carousel>
  )
}

const Arrow = ({ isRight, onClick }) => {
  return (
    <button
      type="button"
      className={'hidden md:block bg-[#D1DBFF] p-2 rounded-full z-50 '.concat(
        isRight
          ? ' !absolute top-2/4 -translate-y-2/4 !right-4 lg:!right-10'
          : ' !absolute top-2/4 -translate-y-2/4 left-4 lg:!left-10',
      )}
      onClick={onClick}
    >
      {isRight ? (
        <MdOutlineKeyboardArrowRight className="text-4xl text-primary" />
      ) : (
        <MdOutlineKeyboardArrowLeft className="text-4xl text-primary" />
      )}
    </button>
  )
}

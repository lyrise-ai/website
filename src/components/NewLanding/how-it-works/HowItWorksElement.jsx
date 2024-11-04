import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { AiOutlineArrowRight } from 'react-icons/ai'
import Img from '../../Product/Img'

const options = {
  root: null, // default, use viewport
  rootMargin: '0px 0px -20% 0px',
  threshold: 0.5, // half of item height
}

export default function HowItWorksElement({
  id,
  title,
  description,
  icon,
  image,
  imageClassName,
  getStartedUrl,
  isReversed = false,
  setElementInView,
}) {
  const [ref, isInView] = useInView(options)

  useEffect(() => {
    if (isInView) {
      setElementInView(id)
    }
  }, [isInView, setElementInView, id])

  return (
    <div
      ref={ref}
      className={`h-fit md:h-[70vh] flex flex-col md:grid md:grid-cols-11 gap-5 lg:gap-20 mx-5 md:mx-16 lg:mx-32 my-5 md:my-10 lg:my-20`}
    >
      <div
        className={`flex flex-col justify-center col-span-5 ${
          isReversed ? 'order-first' : 'order-last'
        }`}
      >
        <h1 className="font-semibold text-[2.6rem] pb-5 font-primary">
          {title}
        </h1>
        <p className="font-primary-500 text-2xl text-neutral-700 pb-5 font-secondary">
          {description}
        </p>
        <Link href={getStartedUrl}>
          <span className="text-primary cursor-pointer">
            Get Started <AiOutlineArrowRight className="inline-block" />
          </span>
        </Link>
      </div>
      <div
        className="col-span-6 rounded-xl overflow-hidden bg-white relative p-0"
        style={{
          boxShadow: '0px 11.861px 23.722px 0px rgba(0, 34, 158, 0.15)',
        }}
      >
        <Img
          alt={image}
          src={image}
          className={imageClassName}
          objectFit="cover"
          style={{ zIndex: 0 }}
        />
      </div>
    </div>
  )
}

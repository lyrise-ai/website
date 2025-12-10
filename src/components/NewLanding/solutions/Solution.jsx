import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'
import ArrowButton from '../../Buttons/ArrowButton'

export default function Solution({
  title,
  subtitle,
  description,
  ctaLabel,
  ctaUrl,
  children,
}) {
  return (
    <section
      className="flex flex-col items-center gap-5 md:gap-8 p-5 md:p-8 bg-white mx-auto md:max-w-6xl rounded-2xl max-md:mx-5"
      style={{
        boxShadow: '0px 9px 18px 0px rgba(0, 34, 158, 0.15)',
      }}
    >
      <h2 className="text-3xl lg:text-4xl font-semibold font-primary mb-5">
        {title}
      </h2>
      <div className="flex flex-1 gap-5">{children}</div>
      <div className="rounded-lg bg-primary-25 p-3">
        <h4 className="font-secondary text-base md:text-lg font-semibold">
          {subtitle}
        </h4>
        <p className="font-secondary text-sm md:text-base text-neutral-500 mb-2">
          {description}
        </p>
        <Link href={ctaUrl} legacyBehavior>
          <ArrowButton
            showArrow
            extraRounded
            className="!text-base md:!text-lg"
          >
            {ctaLabel}
          </ArrowButton>
        </Link>
      </div>
    </section>
  )
}

Solution.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  ctaLabel: PropTypes.string.isRequired,
  ctaUrl: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

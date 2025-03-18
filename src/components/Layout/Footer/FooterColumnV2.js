import Grid from '@mui/material/Grid'
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useMediaQuery } from '@mui/material'
import LinkHeading from '../../shared/Link/Heading'
import SubLink from '../../shared/Link/SubLink'
import { usePathname } from 'next/navigation'

const FooterColumnV2 = ({ heading, links }) => {
  const mobile = useMediaQuery('(max-width: 887px)')
  const under440 = useMediaQuery('(max-width: 440px)')
  const pathname = usePathname()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  return (
    <div className="flex flex-col gap-2 md:gap-2 w-fit">
      <h3 className="font-[500] text-[20px] md:text-[24px] text-white font-primary ">
        {heading}
      </h3>
      <div className="flex flex-col">
        {links.map(({ id, href, text }) => (
          <Link
            key={id}
            passHref
            href={href}
            scroll={false}
            target={href === '#' || pathname === href ? undefined : '_blank'}
            rel="noopener noreferrer"
            onClick={pathname === href && scrollToTop}
          >
            <span className="font-normal font-secondary text-[16px] md:text-[18px] text-white  leading-4">
              {text}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FooterColumnV2

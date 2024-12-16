import Grid from '@mui/material/Grid'
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useMediaQuery } from '@mui/material'
import LinkHeading from '../../shared/Link/Heading'
import SubLink from '../../shared/Link/SubLink'

const FooterColumn = ({ heading, links }) => {
  const mobile = useMediaQuery('(max-width: 887px)')
  const under440 = useMediaQuery('(max-width: 440px)')

  return (
    <>
      <Grid
        item
        xs={mobile ? 4 : 2}
        container
        direction="column"
        alignItems="flex-start"
      >
        <ul>
          <h3 className="font-semibold text-[20px] md:text-[24px] text-[#1C1C1C]">
            {heading}
          </h3>
          {links.map(({ id, href, text }) => (
            <li key={id}>
              <Link
                passHref
                href={href}
                scroll={false}
                target={href === '#' ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <span className="font-normal text-[16px] md:text-[18px] text-[#1C1C1C] leading-4">
                  {text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    </>
  )
}

FooterColumn.propTypes = {
  heading: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired,
}

export default FooterColumn

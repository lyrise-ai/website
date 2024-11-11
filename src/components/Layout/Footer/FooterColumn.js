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

  return (<>
    <Grid
      item
      xs={mobile ? 4 : 2}
      container
      direction="column"
      gap="16px"
      alignItems="flex-start"
    >
      <ul>
        <Grid item>
          <LinkHeading>{heading}</LinkHeading>
        </Grid>
        {links.map(({ id, href, text }) => (
          <li key={id}>
            <Link
              passHref
              href={href}
              scroll={false}
              target={href === '#' ? undefined : '_blank'}
              rel="noopener noreferrer">

              <SubLink
                fontSize={under440 ? '12px' : mobile ? '15px' : '20px'}
              >
                {text}
              </SubLink>

            </Link>
          </li>
        ))}
      </ul>
    </Grid>
  </>);
}

FooterColumn.propTypes = {
  heading: PropTypes.string.isRequired,
  links: PropTypes.array.isRequired,
}

export default FooterColumn

/* eslint-disable sonarjs/no-duplicate-string */
import { Grid, useMediaQuery } from '@mui/material'
import Image from 'next/legacy/image'
import PropTypes from 'prop-types'
import React from 'react'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'
import SubTitle from '../../../shared/SubTitle/SubTitle'
import Title from '../../../shared/Title/Title'
import styles from './card.module.css'

import Img from '../../../Product/Img'

const Card = ({ title, img, description, icon, section }) => {
  const { pathname } = useRouter()
  const under400 = useMediaQuery('(max-width: 400px)')

  const [isHovered, setIsHovered] = React.useState(false)

  const onClickHandler = () => {
    if (process.env.NEXT_PUBLIC_ENV === 'production') {
      const eventProperties = {
        section,
        page: pathname,
      }

      amplitude
        .getInstance()
        .logEvent('PressedScheduleAMeeting', eventProperties)
      ReactGA.event({
        category: `MainLandingPage-${section}`,
        action: 'PressedScheduleAMeeting',
      })
    }
  }

  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      gap={icon ? '10px' : undefined}
      className={styles.card}
      justifyContent="center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Grid
        container
        direction="column"
        justifyContent={!icon ? 'center' : under400 ? 'center' : 'flex-start'}
        alignItems={section === 'leave-to-lyrise' ? 'flex-start' : 'center'}
        gap={1}
      >
        {icon ? (
          <Grid item sx={{ marginRight: '10px' }}>
            <Image src={icon} style={{ maxWidth: '100%' }} />
          </Grid>
        ) : null}
        <Grid item>
          <Title
            fontSize="24px"
            style={{
              marginBottom: icon ? undefined : '20px',
              fontWeight: '700',
            }}
          >
            {title}
          </Title>
        </Grid>
      </Grid>
      {!icon ? (
        <Img
          src={img}
          className="w-full h-1/2 object-contain flex justify-center"
          alt={title}
        />
      ) : null}
      <SubTitle>{description}</SubTitle>
      <a
        onClick={onClickHandler}
        style={{
          alignSelf: 'flex-start',
          color: '#2A5BF9',
          textDecoration: 'underline',
          opacity: isHovered ? '1' : '0',
          fontSize: under400 ? '16px' : '24px',
        }}
        href="/Employer"
        target="_blank"
        rel="noopener noreferrer"
      >
        {pathname === '/' ? 'Hire Vetted Talent' : 'Schedule a meeting'}
        {' >'}
      </a>
    </Grid>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  img: PropTypes.object,
  description: PropTypes.string.isRequired,
  icon: PropTypes.object,
  section: PropTypes.string.isRequired,
}

Card.defaultProps = {
  icon: undefined,
  img: undefined,
}

export default Card

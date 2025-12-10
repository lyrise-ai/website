/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Grid, Typography, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'
import React from 'react'
import Link from 'next/link'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'
import SubTitle from '../shared/SubTitle/SubTitle'
import Title from '../shared/Title/Title'
import { subtitle, title } from './style'
import heroGirl from '../../assets/hero-girl.png'
import GetInTouch from '../shared/GetInTouch/GetInTouch'
// import { FirebaseConsumer } from '../../context/FirebaseContext'
import { ImgComponent } from '../shared/ImageComponent/ImageComponent'

const HeroSection = ({
  title: titleProp,
  subtitle: subtitleProp,
  img,
  isTalent,
}) => {
  const aboveTablet = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const mid = useMediaQuery('(max-width:1000px)')
  const matches = useMediaQuery('(max-width:400px)')
  const under770px = useMediaQuery('(max-width:770px)')
  const under500px = useMediaQuery('(max-width:500px)')
  const under368px = useMediaQuery('(max-width:368px)')
  const { pathname } = useRouter()

  return (
    <div className="container">
      <Grid
        container
        direction={mid ? 'column-reverse' : 'row'}
        justifyContent={mid ? 'center' : 'space-between'}
      >
        <Grid
          item
          xs={under770px && 12}
          sm={under770px ? 12 : 5}
          md={aboveTablet && mid ? 6 : 4}
          container
          direction="column"
          spacing={1}
          gap={1}
          alignItems={mid ? 'center' : 'flex-start'}
          paddingTop="58px"
        >
          <Grid item>
            <Title
              fontSize={mid ? '2rem' : '2.6rem'}
              style={title}
              fontWeight="500"
              textAlign={mid ? 'center' : 'left'}
            >
              {titleProp}
            </Title>
          </Grid>
          <Grid item>
            <SubTitle style={subtitle} textAlign={mid && 'center'}>
              {subtitleProp}
            </SubTitle>
          </Grid>
          <Grid
            item
            style={{ width: matches ? '100%' : undefined, zIndex: '99' }}
          >
            <GetInTouch isTalent={isTalent} />
          </Grid>
          <Grid item>
            <Typography
              sx={{
                fontFamily: 'Cairo',
                fontWeight: '500',
                fontSize: under368px ? '12px' : under500px ? '16px' : '20px',
                lineHeight: '120%',
                letterSpacing: '-0.006em',
                color: '#7B7B98',
                whiteSpace: 'nowrap',
              }}
            >
              {isTalent
                ? 'Looking for top talents?'
                : 'Looking for your next career move?'}

              <span style={{ marginLeft: '8px' }}>
                <Link
                  href={isTalent ? '/' : '/talents'}
                  passHref
                  style={{
                    fontFamily: 'Cairo',
                    fontSize: under368px
                      ? '12px'
                      : under500px
                      ? '16px'
                      : '20px',
                    fontWeight: '500',
                    lineHeight: '24px',
                    letterSpacing: '-0.006em',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'inline',
                    color: '#4200FF',
                  }}
                  onClick={() => {
                    if (
                      process.env.NEXT_PUBLIC_ENV === 'production' &&
                      typeof window !== 'undefined' &&
                      isTalent
                    ) {
                      const eventProperties = {
                        section: 'talent-hero-section',
                        page: pathname,
                      }

                      amplitude
                        .getInstance()
                        .logEvent('PressedStartHiring', eventProperties)
                      ReactGA.event({
                        category: 'TalentPage-HeroSection',
                        action: 'PressedStartHiring',
                      })
                    }
                    if (
                      process.env.NEXT_PUBLIC_ENV === 'production' &&
                      typeof window !== 'undefined' &&
                      !isTalent
                    ) {
                      const eventProperties = {
                        section: 'employer-hero-section',
                        page: pathname,
                      }

                      amplitude
                        .getInstance()
                        .logEvent('PressedApplyForJobs', eventProperties)
                      ReactGA.event({
                        category: 'MainLandingPage-HeroSection',
                        action: 'PressedApplyForJobs',
                      })
                    }
                  }}
                >
                  {isTalent ? 'Start Hiring' : ' Apply For Jobs'}
                </Link>
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={7} md={8} container justifyContent="flex-end">
          <ImgComponent
            source={img}
            alt="hero image"
            height="500px"
            styles={{
              marginRight: mid ? '0px' : '-90px',
              height: under368px ? '250px' : under500px ? '400px' : '600px',
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default HeroSection

HeroSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  img: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
  isTalent: PropTypes.bool,
}

HeroSection.defaultProps = {
  title: 'Build your AI team faster',
  subtitle:
    'Find the perfect candidate for your team and hire the top AI and data talents in a pool of top notch profiles.',
  img: heroGirl,
  isTalent: false,
}

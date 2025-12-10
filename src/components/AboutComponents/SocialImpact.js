import { Box, ButtonBase, Grid, useMediaQuery } from '@mui/material'
import Head from 'next/head'
import Slider from 'react-slick'
import PropTypes from 'prop-types'
import Image from 'next/legacy/image'
import CarouselCard from './CarouselCard'
import LeftArrow from '../../assets/about/leftArrow.png'
import Title from '../shared/Title/Title'

function PrevArrow(props) {
  const { className, style, onClick } = props

  return (
    <ButtonBase
      className={`arrow-btn next ${className}`}
      style={{
        ...style,
        background: '#D1DBFF',
        position: 'absolute',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClick}
    >
      <Image src={LeftArrow} />
    </ButtonBase>
  )
}

function NextArrow(props) {
  const { className, style, onClick } = props
  return (
    <ButtonBase
      className={`arrow-btn prev ${className}`}
      style={{
        ...style,
        background: '#D1DBFF',
        position: 'absolute',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClick}
    >
      <Image src={LeftArrow} style={{ transform: 'rotate(180deg)' }} />
    </ButtonBase>
  )
}

const SocialImpact = ({ items }) => {
  const under1000 = useMediaQuery('(max-width: 1000px)')
  const under400 = useMediaQuery('(max-width: 400px)')

  const settings = {
    dots: true,
    autoplaySpeed: 5000,
    infinite: true,
    autoplay: true,
    arrows: !under1000,
    speed: 500,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
        <Grid item xs={12} className="m-top">
          <div className="container">
            <Box>
              <Title
                fontWeight="500"
                fontSize="36px"
                lineHeight="44px"
                textAlign="center"
                maxWidth="836px"
                margin="0 auto 40px auto"
                letterSpacing="-0.02rem"
              >
                Social Impact
              </Title>
            </Box>
            <Slider
              {...settings}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #EAECF0',
                borderRadius: '20px',
                padding: under400
                  ? '10px'
                  : under1000
                  ? '25px'
                  : '0 0 15px 80px',
              }}
            >
              {items?.map(({ id, title1, title2, content, imgSm, imgLg }) => (
                <CarouselCard
                  key={id}
                  id={id}
                  title1={title1}
                  title2={title2}
                  content={content}
                  imgSm={imgSm}
                  imgLg={imgLg}
                />
              ))}
            </Slider>
          </div>
        </Grid>
      </Grid>
    </>
  )
}

SocialImpact.propTypes = {
  items: PropTypes.array.isRequired,
}

SocialImpact.defaultProps = {}

export default SocialImpact

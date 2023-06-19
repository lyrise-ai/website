import { Grid, useMediaQuery } from '@mui/material'
import { Box } from '@mui/system'
import PropTypes from 'prop-types'
import Image from 'next/image'
import React from 'react'
import SecondaryText from './SecondaryText'

const CarouselCard = ({ id, title1, title2, content, imgSm, imgLg }) => {
  const under1000 = useMediaQuery('(max-width: 1000px)')
  const under500 = useMediaQuery('(max-width: 500px)')
  const under400 = useMediaQuery('(max-width: 400px)')

  return (
    <Grid
      container
      direction={under1000 ? 'column' : 'row'}
      justifyContent="space-between"
      sx={{ minHeight: under500 ? '250px' : under1000 ? 'auto' : '450px' }}
    >
      <Grid item container direction="column" sx={{ marginTop: '83px' }} xs={6}>
        <Grid item container wrap="nowrap" alignItems="center">
          {under400 ? null : (
            <Grid item>
              <Box
                style={{
                  width: '76px',
                  height: '76px',
                  position: 'relative',
                  overflow: 'visible',
                  display: 'block',
                }}
              >
                <Image
                  src={imgSm}
                  alt="image"
                  loading="eager"
                  layout="fill"
                  objectFit="contain"
                  style={{ overflow: 'visible' }}
                  priority
                  quality={95}
                />
              </Box>
            </Grid>
          )}
          <Grid item sx={{ marginLeft: '15px' }}>
            {id === 4 ? (
              <p
                style={{
                  fontSize: under1000 ? '24px' : '32px',
                  fontWeight: '700',
                  lineHeight: '38px',
                  color: '#2957FF',
                }}
              >
                {title1}
              </p>
            ) : (
              <>
                <p
                  style={{
                    fontSize: under1000 ? '24px' : '32px',
                    fontWeight: '700',
                    lineHeight: '38px',
                    color: '#2957FF',
                  }}
                >
                  {title1}
                </p>
                <p
                  style={{
                    fontSize: under1000 ? '24px' : '32px',
                    fontWeight: '700',
                    lineHeight: '38px',
                    color: '#2957FF',
                  }}
                >
                  {title2}
                </p>
              </>
            )}
          </Grid>
        </Grid>
        <SecondaryText text={content} styles={{ marginTop: '20px' }} />
      </Grid>
      <Grid item xs={6}>
        <Box
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'visible',
            display: 'block',
          }}
        >
          <Image
            src={imgLg}
            alt="image"
            loading="eager"
            layout="fill"
            objectFit="contain"
            style={{ overflow: 'visible' }}
            priority
            quality={95}
          />
        </Box>
      </Grid>
    </Grid>
  )
}

CarouselCard.propTypes = {
  id: PropTypes.number.isRequired,
  title1: PropTypes.string.isRequired,
  title2: PropTypes.string,
  content: PropTypes.string.isRequired,
  imgSm: PropTypes.object.isRequired,
  imgLg: PropTypes.object.isRequired,
}

CarouselCard.defaultProps = {
  title2: '',
}

export default CarouselCard

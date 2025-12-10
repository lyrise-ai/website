import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/legacy/image'
import { Grid, useMediaQuery } from '@mui/material'

export function Card({ imagePack }) {
  const [isHovered, setIsHovered] = React.useState(false)
  const mobile = useMediaQuery('(max-width: 768px)')
  const small = useMediaQuery('(max-width: 550px)')
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{
        display: 'inline-block',
        margin: small ? '0 20px' : mobile ? '0 30px' : '0 80px',
        width: '160px',
        userSelect: 'none',
        height: '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Grid
        item
        container
        alignContent="center"
        alignItems="center"
        style={{
          height: '100%',
        }}
      >
        {isHovered ? (
          <Image src={imagePack.image} draggable={false} priority />
        ) : (
          <Image src={imagePack.greyImage} draggable={false} priority />
        )}
      </Grid>
    </Grid>
  )
}

Card.propTypes = {
  imagePack: PropTypes.any.isRequired,
}

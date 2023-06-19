import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import Card from './Card/Card'
import { cards as cardsData } from './CardsData'
import { cardsContainer } from './style'

const Cards = ({ cards: cardsProp, section }) => {
  const mobile = useMediaQuery('(max-width:800px)')
  return (
    <Grid
      container
      direction={mobile ? 'column' : 'row'}
      justifyContent="center"
      alignItems={mobile ? 'center' : undefined}
      style={cardsContainer}
    >
      {cardsProp
        ? cardsProp.map(({ id, title, icon, description }) => (
            <Card
              title={title}
              description={description}
              icon={icon}
              key={id}
              section={section}
            />
          ))
        : cardsData.map(({ id, title, img, description }) => (
            <Card
              title={title}
              description={description}
              img={img}
              key={id}
              section={section}
            />
          ))}
    </Grid>
  )
}

Cards.propTypes = {
  cards: PropTypes.array,
  section: PropTypes.string.isRequired,
}

Cards.defaultProps = {
  cards: undefined,
}

export default Cards

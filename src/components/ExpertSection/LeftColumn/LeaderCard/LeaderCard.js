import { CardMedia, Paper } from '@mui/material'
import React from 'react'
import PropTypes from 'prop-types'
import { LeaderName } from './LeaderName/LeaderName'
import { LeaderTitle } from './LeaderTitle/LeaderTitle'
import { cardMediaStyle, cardStyle } from './style'

const LeaderCard = ({ style }) => {
  return (
    <Paper
      sx={{
        ...cardStyle,
        ...style,
      }}
      elevation={0}
    >
      <CardMedia
        component="img"
        height="190"
        width="190"
        image="https://images.unsplash.com/photo-1521443331827-88ee11ea2706?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1440&q=80"
        alt="green iguana"
        style={cardMediaStyle}
      />
      <div>
        <LeaderName>Maurice Gabby</LeaderName>
        <LeaderTitle>Senior Hiring Manager at Google</LeaderTitle>
      </div>
    </Paper>
  )
}

LeaderCard.propTypes = {
  style: PropTypes.any,
}

LeaderCard.defaultProps = {
  style: {},
}

export default LeaderCard

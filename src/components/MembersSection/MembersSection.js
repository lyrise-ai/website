import { Grid } from '@mui/material'
import React from 'react'
import { members } from './cardsData'
import MemberCard from './MemberCard/MemberCard'

const MembersSection = () => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-evenly"
      style={{ display: 'none' }}
      wrap="wrap"
    >
      {members.map(({ id, img, name, position }) => (
        <MemberCard key={id} img={img} name={name} position={position} />
      ))}
    </Grid>
  )
}

export default MembersSection

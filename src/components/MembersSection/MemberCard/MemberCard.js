import React from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import Image from 'next/legacy/image'
import Title from '../../shared/Title/Title'
import SubTitle from '../../shared/SubTitle/SubTitle'
import code from '../../../assets/code.svg'
import meta from '../../../assets/meta.svg'
import { active } from './style'

const MemberCard = ({ img, name, position }) => {
  const [isHovered, setIsHovered] = React.useState(false)
  return (
    <Grid
      item
      xs={4}
      md={2}
      container
      direction="column"
      alignItems="center"
      minWidth="220px"
      style={{ padding: '12px', borderRadius: '8px' }}
      sx={isHovered ? active : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image src={img} alt={name} />
      <Title fontSize="20px">{name}</Title>
      <Grid
        item
        container
        direction="row"
        justifyContent="space-between"
        wrap="nowrap"
      >
        <Image src={code} alt="code" />
        <SubTitle style={{ whiteSpace: 'nowrap' }}>{position}</SubTitle>
        <Image src={meta} alt="meta" />
      </Grid>
    </Grid>
  )
}

MemberCard.propTypes = {
  img: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
}

export default MemberCard

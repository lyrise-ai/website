import React from 'react'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/image'
import forbesImage from '../../assets/Forbes.png'
import ScheduleMeetingButton from '../Buttons/ScheduleMeetingButton'
import SubTitle from '../shared/SubTitle/SubTitle'
import Title from '../shared/Title/Title'
import { forbesContainer, forbesLeft, subtitle, title } from './style'

const ForbesSection = () => {
  const mobile = useMediaQuery('(max-width: 900px)')
  return (
    <Grid
      className="container"
      container
      direction={mobile ? 'column' : 'row'}
      justifyContent="center"
      spacing={!mobile ? 5 : undefined}
      style={mobile ? undefined : forbesContainer}
    >
      {/* left side image */}
      <Grid item container justifyContent="center" xs={7} style={forbesLeft}>
        <Image src={forbesImage} priority />
      </Grid>
      {/* right side content */}
      <Grid
        item
        container
        direction="column"
        alignItems={mobile ? 'flex-start' : undefined}
        xs={5}
        style={{
          paddingTop: '40px',
          paddingBottom: mobile ? '40px' : undefined,
        }}
      >
        <Grid item>
          <Title style={title}>Media Coverage</Title>
        </Grid>
        <Grid item>
          <SubTitle style={subtitle}>
            LyRise aims to solve the shortage of AI expertise by building remote
            AI teams. Banoub participated in the first MIT Deep Technology
            Bootcamp.
          </SubTitle>
        </Grid>
        <Grid item>
          <ScheduleMeetingButton
            white
            text="Learn More"
            link="https://www.forbesmiddleeast.com/lists/30-under-30-2021/marc-banoub/"
            location="ForbesSection"
            eventType="visited-forbes"
            isTalent={false}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ForbesSection

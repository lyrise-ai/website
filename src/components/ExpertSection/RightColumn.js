import * as React from 'react'
import { Grid, useMediaQuery } from '@mui/material'
import Title from '../shared/Title/Title'
import SubTitle from '../shared/SubTitle/SubTitle'
import ScheduleMeetingButton from '../Buttons/ScheduleMeetingButton'
import { AccordionData } from './AccordionData'
import CustomizedAccordions from '../AISection/Accordion'

export default function RightColumn() {
  const mobile = useMediaQuery('(max-width: 600px)')

  return (
    <Grid
      item
      container
      direction="column"
      md={6}
      xs={12}
      spacing={2}
      justifyContent="center"
      sx={{ zIndex: '10', padding: mobile ? '0' : undefined }}
    >
      <Grid item container direction="column">
        <Grid
          item
          sx={{
            marginBottom: '20px',
          }}
        >
          <Title textAlign="left" fontWeight="500">
            Vetting conducted by industry experts
          </Title>
        </Grid>
        <Grid
          item
          sx={{
            marginBottom: '20px',
          }}
        >
          <SubTitle>
            Our talents go through a vigorous process that qualifies the top
            applicants just for you.
          </SubTitle>
        </Grid>
      </Grid>
      <Grid item container direction="column" justifyContent="center">
        <CustomizedAccordions AccordionData={AccordionData} />
      </Grid>
      <Grid
        item
        sx={{
          marginTop: mobile ? '10px' : '40px',
        }}
      >
        <ScheduleMeetingButton location="ExpertSection" isTalent={false} />
      </Grid>
    </Grid>
  )
}

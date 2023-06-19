import * as React from 'react'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import Title from '../shared/Title/Title'
import CustomizedAccordions from './Accordion'
import ScheduleMeetingButton from '../Buttons/ScheduleMeetingButton'
import { AccordionData } from './AccordionData'
import SubTitle from '../shared/SubTitle/SubTitle'
import Steps from './Steps'

export default function AILeftColumn({ title, subtitle, steps }) {
  const mobile = useMediaQuery('(max-width: 1000px)')
  return (
    <Grid
      item
      xs={mobile ? 12 : 5}
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="flex-start"
      spacing={mobile ? 3 : undefined}
    >
      <Grid item>
        <Title>{title}</Title>
      </Grid>
      {steps?.length > 0 ? (
        <Grid item>
          {subtitle ? (
            <Grid item mb={2}>
              <SubTitle>{subtitle}</SubTitle>
            </Grid>
          ) : null}
          <Steps steps={steps} />
        </Grid>
      ) : (
        <Grid item>
          <CustomizedAccordions AccordionData={AccordionData} rotate="true" />
        </Grid>
      )}
      <Grid item>
        <ScheduleMeetingButton
          text="Start Hiring"
          location="HireYourTalentSection"
          isTalent={false}
        />
      </Grid>
    </Grid>
  )
}

AILeftColumn.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string),
}

AILeftColumn.defaultProps = {
  steps: [],
}

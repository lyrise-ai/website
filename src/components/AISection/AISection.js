import * as React from 'react'
import Grid from '@mui/material/Grid'
import PropTypes from 'prop-types'
import useMediaQuery from '@mui/material/useMediaQuery'
import Image from 'next/legacy/image'
import aiSection2 from '../../assets/aiSection2.png'
import AILeftColumn from './AILeftColumn'

export default function AISection({ title, subtitle, steps, img }) {
  const mobile = useMediaQuery('(max-width: 1000px)')
  return (
    <div className="container" id="ai-section">
      <Grid
        container
        direction={mobile ? 'column-reverse' : 'row'}
        justifyContent={mobile ? 'center' : 'space-evenly'}
        spacing={mobile ? 8 : undefined}
      >
        <AILeftColumn title={title} subtitle={subtitle} steps={steps} />
        <Grid
          item
          container
          justifyContent="flex-end"
          xs={6}
          sx={{ paddingLeft: '2vw' }}
        >
          <Image src={img} />
        </Grid>
      </Grid>
    </div>
  )
}

AISection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  steps: PropTypes.arrayOf(PropTypes.string),
  img: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
}

AISection.defaultProps = {
  img: aiSection2,
  title: 'Hire your talent in two weeks',
  subtitle: '',
  steps: [],
}

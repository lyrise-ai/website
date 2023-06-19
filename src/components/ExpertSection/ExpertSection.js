import * as React from 'react'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import RightColumn from './RightColumn'
import LeftColumn from './LeftColumn/LeftColumn'

export default function ExpertSection() {
  const mobile = useMediaQuery('(max-width: 1000px)')
  const under600 = useMediaQuery('(max-width: 600px)')

  return (
    <div className="container">
      <Grid
        container
        direction={mobile ? 'column' : 'row'}
        alignItems={!mobile ? 'center' : 'flex-start'}
        justifyContent="center"
        wrap="wrap"
        gap={mobile ? '30px' : undefined}
        spacing={mobile ? undefined : 2}
        sx={{
          width: mobile ? '100%' : undefined,
          padding: under600 ? '0' : '1.563rem',
        }}
      >
        <Grid item xs={4} md={6}>
          <LeftColumn />
        </Grid>
        <RightColumn />
      </Grid>
    </div>
  )
}

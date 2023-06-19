import { Grid, Typography, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'

export default function FormWrapper({ title, children, header }) {
  const under1100 = useMediaQuery('(max-width: 1100px)')
  const under520 = useMediaQuery('(max-width: 520px)')
  return (
    <>
      <Grid item container direction="column" alignItems="flex-start" mt="12px">
        <Grid item xs={12}>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '600',
              fontSize: under520 ? '24px' : '32px',
              lineHeight: '110%',
              color: '#1D1B1B',
              marginBottom: '8px',
            }}
          >
            {header}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: under520 ? '16px' : '24px',
              lineHeight: '120%',
              color: 'rgba(0, 0, 29, 0.5)',
              marginBottom: under520 ? '32px' : '54px',
              textAlign: under1100 ? 'center' : 'left',
            }}
          >
            {title}
          </Typography>
        </Grid>
        <Grid item container direction="column" gap={2.5} xs={12}>
          {children}
        </Grid>
      </Grid>
    </>
  )
}

FormWrapper.propTypes = {
  header: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

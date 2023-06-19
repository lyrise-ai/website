// Circle adem
/* eslint-disable sonarjs/cognitive-complexity */
import { Grid, Typography, useMediaQuery } from '@mui/material'
import PropTypes from 'prop-types'

const circleStyles = '278px !important'
const circleBackgroundColor = 'rgba(209, 219, 255,0.5)'
const circleBoxShadow = '0px 0px 0px 4px rgba(41, 87, 255,0.5)'

const EthosCircle = ({ etho }) => {
  const under768 = useMediaQuery('(max-width: 768px)')
  const under600 = useMediaQuery('(max-width: 600px)')
  const under300 = useMediaQuery('(max-width: 300px)')

  const calcCircleWidth = () => {
    return under300
      ? '100px '
      : under600
      ? '120px '
      : under768
      ? '180px '
      : circleStyles
  }
  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        position: 'relative',
        left: etho.id === '1' ? '2%' : undefined,
        right: etho.id === '2' ? '2%' : undefined,
        width: calcCircleWidth(),
        height: calcCircleWidth(),
        // border: borderStyles,
        borderRadius: '50%',
        color: '#2957FF',
        backgroundColor: circleBackgroundColor,
        boxShadow: circleBoxShadow,
      }}
    >
      <Grid item>
        <Typography
          sx={{
            maxWidth: '152px',
            textAlign: 'center',
            color: '#2957FF',
            fontWeight: '500',
            fontSize: under300
              ? '10px'
              : under600
              ? '12px'
              : under768
              ? '16px'
              : '24px',
          }}
        >
          {etho.text}
        </Typography>
      </Grid>
    </Grid>
  )
}

EthosCircle.propTypes = {
  etho: PropTypes.object.isRequired,
}
export default EthosCircle

import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import Title from '../shared/Title/Title'
import { Ethos } from '../../constants/aboutConstants'
import EthosCircle from './EthosCircle'

const borderStyles = '4px solid #91A8FD'
const circleStyles = '278px '
const circleBackgroundColor = 'rgba(209, 219, 255,0.5)'
const circleBoxShadow = '0px 0px 0px 4px rgba(41, 87, 255,0.5)'

const EthosSection = () => {
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
    <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
      <Grid item xs={12} className="m-top">
        <div className="container">
          <Box sx={{ marginTop: '80px' }}>
            <Title
              fontWeight="500"
              fontSize="36px"
              lineHeight="44px"
              textAlign="center"
              maxWidth="836px"
              margin="12px auto 0 auto"
              letterSpacing="-0.02rem"
            >
              Our Ethos
            </Title>
          </Box>
          <Grid
            container
            direction="column"
            wrap="wrap"
            alignItems="center"
            sx={{
              maxWidth: '702px',
              width: under600 ? '100%' : under768 ? '90%' : undefined,
              position: 'relative',
              border: borderStyles,
              color: '#EFF2FF',
              margin: '20px auto 0 auto',
              zIndex: '10',
              backgroundColor: '#EFF2FF',
              borderRadius: '267px',
            }}
          >
            <Grid item>
              {/* circle top */}
              <Grid
                item
                container
                justifyContent="center"
                alignItems="center"
                sx={{
                  position: 'absolute',
                  left: '51%',
                  top: '33%',
                  transform: 'translate(-56%, -50%)',
                  width: calcCircleWidth(),
                  height: calcCircleWidth(),
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
                    Efficiency
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              container
              wrap="nowrap"
              justifyContent="center"
              sx={{
                textAlign: 'center',
                position: 'relative',
                marginTop: under600 ? '120px' : under768 ? '160px' : '200px',
              }}
            >
              {Ethos?.map((etho) => (
                <EthosCircle key={etho.id} etho={etho} />
              ))}
            </Grid>
            {/* impact text */}
            <Grid
              item
              xs={12}
              sx={{
                marginTop: under768 ? '12px' : '36px',
                color: '#2957FF',
                textAlign: 'center',
                marginBottom: under768 ? '12px' : '23px',
              }}
            >
              <Typography
                sx={{
                  fontSize: under768 ? '18px' : undefined,
                  transform: 'translateY(-53%)',
                }}
              >
                Impact
              </Typography>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  )
}

export default EthosSection

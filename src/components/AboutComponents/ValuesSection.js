import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import { VALUES_CARDS } from '../../constants/aboutConstants'
import Title from '../shared/Title/Title'
import TinyTitle from './TinyTitle'
import ValueCard from './ValueCard'

const ValuesSection = () => {
  const under1000 = useMediaQuery('(max-width: 1000px)')

  return (
    <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
      <Grid item xs={12} className="m-top">
        <Box className="container">
          <Grid container direction="column">
            <Grid item container direction="column" alignItems="center">
              <TinyTitle text="Our values" />
              <Title
                fontWeight="500"
                fontSize="36px"
                lineHeight="44px"
                textAlign="center"
                maxWidth="600px"
                margin="12px auto 0 auto"
                letterSpacing="-0.02rem"
              >
                We’re an ambitious and smart team with a shared mission
              </Title>
              <Typography
                sx={{
                  fontSize: '20px',
                  lineHeight: '30px',
                  fontweight: '400',
                  textAlign: 'center',
                  color: '#475467',
                  marginTop: '20px',
                }}
              >
                Our shared values keep us connected and guide us as one team.
              </Typography>
            </Grid>
            <Grid
              item
              container
              sx={{ marginTop: '64px' }}
              gap={under1000 ? '15px' : '57px'}
              justifyContent="center"
            >
              {VALUES_CARDS?.map(({ id, icon, title, description }) => (
                <ValueCard
                  key={id}
                  icon={icon}
                  title={title}
                  description={description}
                />
              ))}
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default ValuesSection

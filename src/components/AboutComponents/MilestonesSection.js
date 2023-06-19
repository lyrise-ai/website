/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/no-unescaped-entities */
import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import Title from '../shared/Title/Title'

const MilestonesSection = () => {
  const under600 = useMediaQuery('(max-width: 600px)')

  return (
    <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
      <Grid item xs={12} className="m-top">
        <div className="container" style={{ margin: '80px auto 50px auto' }}>
          <Grid
            container
            direction={under600 ? 'column' : 'row'}
            gap={under600 ? '20px' : undefined}
          >
            <Grid item xs={6}>
              <Title
                fontSize="36px"
                fontWeight="500"
                lineHeight="120%"
                color="#000"
              >
                LyRise Milestones.
              </Title>
              <Typography
                sx={{
                  fontWeight: '400',
                  fontSize: '20px',
                  lineHeight: '145%',
                  color: '#7B7B98',
                  marginTop: '20px',
                  maxWidth: '475px',
                }}
              >
                LyRise bootstrapped using the founder's all-in: $8K and pivoted
                from an AI-as-a-Service, to AI training programs, and now to an
                AI talent-as-a-Service marketplace growing its customer base to
                15, talent network to over 1000 AI talents growing 10x over a
                few months.
              </Typography>
            </Grid>
            <Grid
              item
              container
              direction="column"
              sx={{ paddingLeft: '50px' }}
              xs={6}
            >
              <Grid
                item
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    height: '100%',
                    width: '1px',
                    left: '-31px',
                    top: '0',
                    background: '#B2C3FF',
                    border: '1px solid #B2C3FF',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    border: '4px solid #D1DBFF',
                    bowShadow: '0px 0px 0px 4px #D1DBFF',
                    backgroundColor: '#F5F7FF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '0',
                    left: '-50px',
                  }}
                >
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#2957FF',
                    }}
                  />
                </Box>
                {/* title */}
                <Typography
                  sx={{
                    fontWeight: '500',
                    fontSize: '20px',
                    lineHeight: '30px',
                    color: '#101828',
                  }}
                >
                  2022
                </Typography>
                <Typography
                  sx={{
                    marginBottom: '18px',
                    color: '#7B7B98',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '145%',
                    paddingLeft: '10px',
                  }}
                >
                  &#x2022; The 1st AI talent marketplace to join Techstars
                  powered by JP Morgan to expand to over 10000 AI engineers &
                  scientists from Africa
                </Typography>
                {/* subtitle */}
              </Grid>
              <Grid
                item
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    height: '100%',
                    width: '1px',
                    left: '-31px',
                    top: '0',
                    background: '#000',
                    border: '1px solid #B2C3FF',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    border: '4px solid #D1DBFF',
                    bowShadow: '0px 0px 0px 4px #D1DBFF',
                    backgroundColor: '#F5F7FF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '0',
                    left: '-50px',
                  }}
                >
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#2957FF',
                    }}
                  />
                </Box>
                {/* title */}
                <Typography
                  sx={{
                    fontWeight: '500',
                    fontSize: '20px',
                    lineHeight: '30px',
                    color: '#101828',
                  }}
                >
                  2021
                </Typography>
                <Typography
                  sx={{
                    marginBottom: '18px',
                    color: '#7B7B98',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '145%',
                    paddingLeft: '10px',
                  }}
                >
                  &#x2022; Pivoted from AI-as-a-Service to Talent-as-a-Service,
                  secured a major TaaS customer, re-branded to LyRise and
                  acquired over 1000 AI - Data talents, established teams
                  internationally in the United States, United Kingdom, Germany,
                  Egypt, Jordan, Nigeria and others.
                </Typography>
                {/* subtitle */}
              </Grid>
              <Grid
                item
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    height: '100%',
                    width: '1px',
                    left: '-31px',
                    top: '0',
                    background: '#000',
                    border: '1px solid #B2C3FF',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    border: '4px solid #D1DBFF',
                    bowShadow: '0px 0px 0px 4px #D1DBFF',
                    backgroundColor: '#F5F7FF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: '0',
                    left: '-50px',
                  }}
                >
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#2957FF',
                    }}
                  />
                </Box>
                {/* title */}
                <Typography
                  sx={{
                    fontWeight: '500',
                    fontSize: '20px',
                    lineHeight: '30px',
                    color: '#101828',
                  }}
                >
                  2020
                </Typography>
                <Typography
                  sx={{
                    marginBottom: '18px',
                    color: '#7B7B98',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '145%',
                    paddingLeft: '10px',
                  }}
                >
                  &#x2022; Launched first AI & Data Science Bootcamp in the MEA
                  region in partnership with Microsoft. Up-skilled {'>'}150 AI
                  engineers & Data Scientists.
                </Typography>
                {/* subtitle */}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  )
}

export default MilestonesSection

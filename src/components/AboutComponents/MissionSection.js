import { Box, Grid, useMediaQuery } from '@mui/material'
import Image from 'next/legacy/image'
import Title from '../shared/Title/Title'
import TinyTitle from './TinyTitle'
import Quote from '../../assets/about/quote.svg'
import QuoteReversed from '../../assets/about/quote-reversed.svg'

const MissionSection = () => {
  const under1000 = useMediaQuery('(max-width: 1000px)')
  const under400 = useMediaQuery('(max-width: 400px)')

  return (
    <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
      <Grid item xs={12}>
        <Grid
          container
          direction="column"
          alignItems="center"
          sx={{
            backgroundColor: '#E1E7FF',
            padding: '48px 0',
            position: 'relative',
            overflow: 'hidden',
            zIndex: '11',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              width: under1000 ? '60px' : '290px',
              height: under1000 ? '48px' : '230px',
              bottom: under1000 ? '-3px' : '-20px',
              right: '52px',
              zIndex: '-1',
            }}
          >
            <Image src={Quote} alt="quotes" layout="fill" loading="lazy" />
          </Box>
          <Box
            style={{
              position: 'absolute',
              width: under1000 ? '60px' : '290px',
              height: under1000 ? '48px' : '230px',
              top: under1000 ? '1px' : '-20px',
              left: '52px',
              zIndex: '-1',
            }}
          >
            <Image
              src={QuoteReversed}
              alt="quotes"
              layout="fill"
              loading="lazy"
            />
          </Box>
          <TinyTitle text="Our vision" />
          <Title
            fontWeight="400"
            fontSize="48px"
            lineHeight="46px"
            textAlign="center"
            maxWidth="693px"
            margin="12px 0 36px 0"
            padding="0 30px"
          >
            Augmenting Intelligence for Companies
          </Title>
          <TinyTitle text="Our mission" />
          <Title
            fontWeight="400"
            fontSize="48px"
            lineHeight="61px"
            textAlign="center"
            maxWidth="830px"
            margin="12px 0 0 0"
            padding={under400 ? '0 10px' : '0 30px'}
          >
            Unlock AI for 1M Companies
          </Title>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default MissionSection

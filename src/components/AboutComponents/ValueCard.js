import { Box, Grid, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import PropTypes from 'prop-types'

const ValueCard = ({ icon, title, description }) => {
  const under1000 = useMediaQuery('(max-width: 1000px)')
  const under768 = useMediaQuery('(max-width: 768px)')
  const under600 = useMediaQuery('(max-width: 600px)')

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      wrap="nowrap"
      item
      xs={under600 ? 12 : under768 ? 6 : under1000 ? 5 : undefined}
      gap="20px"
      p={2}
      sx={{
        border: '2px solid #EAECF0',
        borderRadius: '20px',
        maxWidth: '356px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Grid item>
        <Box sx={{ position: 'relative', width: '48px', height: '48px' }}>
          <Image
            src={icon}
            alt="icon"
            objectFit="contain"
            layout="fill"
            loading="eager"
          />
        </Box>
      </Grid>
      <Grid item>
        <Typography sx={{ textAlign: 'center' }}>{title}</Typography>
        <Typography
          sx={{
            textAlign: 'center',
            marginTop: '8px',
            color: '#475467',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            maxWidth: '324px',
          }}
        >
          {description}
        </Typography>
      </Grid>
    </Grid>
  )
}

ValueCard.propTypes = {
  icon: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}
export default ValueCard

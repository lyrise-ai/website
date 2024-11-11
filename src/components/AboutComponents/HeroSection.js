import { Grid, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image'
import heroImg from '../../assets/about/hero_img.png'
import IBMLogo from '../../assets/about/IBM-logo.svg'
import TechStartsLogo from '../../assets/about/techstars_logo.svg'
import GoogleStartupsLogo from '../../assets/about/google-logo.svg'
import TinyTitle from './TinyTitle'

const HeroSection = () => {
  const under768 = useMediaQuery('(max-width: 768px)')
  const under450 = useMediaQuery('(max-width: 450px)')

  return (
    <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
      <Grid item xs={12} className="m-top">
        <div className="container">
          <Grid
            container
            justifyContent="space-between"
            direction={under768 ? 'column' : 'row'}
            gap={under768 ? '0px' : '60px'}
            wrap="nowrap"
          >
            <Grid
              item
              xs={6}
              container
              direction="column"
              gap="12px"
              alignItems={under768 ? 'center' : 'flex-start'}
              sx={{ order: under768 ? 2 : undefined }}
            >
              <Grid item>
                <TinyTitle
                  text="Our Story"
                  otherStyles={{ textAlign: 'center', fontSize: '16px' }}
                />
              </Grid>
              <Grid item>
                <Typography
                  style={{
                    fontWeight: '400',
                    fontSize: '20px',
                    lineHeight: '29px',
                    color: '#667085',
                  }}
                >
                  Lyrise was founded and inspired by the legacy of Al-Khwarizmi
                  as he’s considered to be the father of algorithms and is
                  widely regarded as the starting point of the field of computer
                  science. His contributions to mathematics and computational
                  thinking laid the foundation for the development of AI.
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    fontSize: '20px',
                    lineHeight: '29px',
                    color: '#667085',
                    marginTop: '11px',
                  }}
                >
                  LyRise is a platform for companies to work with AI talents
                  faster through connecting them with Top AI experts from the
                  MENA region. We provide for companies a tailored secure data
                  infrastructure and efficient cloud compute resource.
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    fontSize: '20px',
                    lineHeight: '29px',
                    color: '#667085',
                    marginTop: '11px',
                  }}
                >
                  Our talents have a strong background and experience backed by
                  companies like Google, IBM, Microsoft. We are the 1st AI
                  talent marketplace to join the IBM Hyperprotect Accelerator,
                  and Techstars powered by JP Morgan to expand to over 10,000 AI
                  engineers & scientists from Africa.
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    fontSize: '20px',
                    lineHeight: '29px',
                    color: '#667085',
                    marginTop: '11px',
                  }}
                >
                  LyRise is backed by Techstars Atlanta powered by JP Morgan and
                  Google for Startups and IBM Hyper Protect Accelerator.
                </Typography>
              </Grid>
              <Grid
                item
                container
                justifyContent="space-between"
                wrap="nowrap"
                gap={under450 ? '5px' : '40px'}
                sx={{
                  maxHeight: '73px !important',
                  maxWidth: '114px',
                  marginTop: '28px',
                }}
              >
                <Grid item xs={4} sx={{ position: 'relative' }}>
                  <Image
                    src={TechStartsLogo}
                    alt="TechStars"
                    width="100%"
                    height="100%"
                    layout="fill"
                    objectFit="contain"
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    position: 'relative',
                    maxWidth: '200px',
                  }}
                >
                  <div style={{ width: '100%' }}>
                    <Image
                      src={GoogleStartupsLogo}
                      alt="Google For Startups"
                      style={{ width: '100%', height: '100%' }}
                      layout="responsive"
                      objectFit="contain"
                    />
                  </div>
                </Grid>
                <Grid item xs={4} sx={{ position: 'relative' }}>
                  <Image
                    src={IBMLogo}
                    alt="IBM"
                    width="100%"
                    height="100%"
                    layout="fill"
                    objectFit="contain"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              container
              alignItems="center"
              xs={6}
              sx={{ paddingTop: '20px', order: under768 ? 1 : undefined }}
            >
              <Grid
                item
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '320px',
                  position: 'relative',
                  overflow: 'visible',
                  display: 'block',
                }}
              >
                <Image
                  src={heroImg}
                  alt="hero image"
                  loading="eager"
                  layout="fill"
                  objectFit="contain"
                  style={{ overflow: 'visible' }}
                  priority
                  quality={95}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  )
}

// HeroSection.propTypes = {
//   isTalent: PropTypes.bool,
// }

// HeroSection.defaultProps = {
//   isTalent: false,
// }

export default HeroSection

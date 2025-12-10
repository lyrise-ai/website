/* eslint-disable @next/next/no-img-element */
import { Grid, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/legacy/image'
import Link from 'next/link'
import LinkedinIcon from '../../assets/about/linkedin.svg'
import Marc from '../../assets/about/marcbanoub.png'
import SecondaryText from './SecondaryText'

const FounderSection = () => {
  const under1024 = useMediaQuery('(max-width: 1024px)')
  const under768 = useMediaQuery('(max-width: 768px)')

  return (
    <Grid container sx={{ backgroundColor: '#F9FAFC' }}>
      <Grid item xs={12} className="m-top">
        <div className="container" style={{ margin: '80px auto 90px auto' }}>
          <Typography
            sx={{
              fontWeight: '500',
              fontSize: '36px',
              lineHeight: '120%',
              textAlign: under768 ? 'center' : 'left',
            }}
          >
            About the Founder
          </Typography>
          <Grid
            container
            direction={under768 ? 'column' : 'row'}
            alignItems={under768 ? 'center' : undefined}
          >
            <Grid item xs={6} sx={{ order: under768 ? 2 : undefined }}>
              <SecondaryText
                text="Marc Banoub is Founder and CEO of LyRise, a platform for companies to work with vetted AI teams faster. LyRise is solving the mis-match in AI & Data talents by building fractional AI teams from emerging markets at half the time and cost."
                styles={{ marginTop: '20px', maxWidth: '690px' }}
              />

              <SecondaryText
                text="Marc has pioneered numerous advanced AI training programs, built a network of over >1.3K AI & Data talents, and helped over 30+ companies build their AI teams, product roadmap and strategy."
                styles={{ marginTop: '12px', maxWidth: '690px' }}
              />
              <Typography sx={{ marginTop: '14px' }}>
                <Link
                  href="https://www.linkedin.com/in/marc-banoub/"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '20px',
                    fontWeight: '400',
                    lineHeight: '28px',
                  }}
                >
                  <Image src={LinkedinIcon} />
                  Visit Linkedin
                </Link>
              </Typography>
            </Grid>
            <Grid
              item
              container
              xs={6}
              sx={{ order: under768 ? 1 : undefined }}
              justifyContent={under768 ? 'center' : 'flex-end'}
            >
              <Grid
                item
                style={{
                  width: '100%',
                  position: 'relative',
                  display: 'block',
                  marginTop: under768 ? undefined : '-10%',
                  transform: under1024 ? undefined : 'translateX(50px)',
                }}
              >
                <Image
                  src={Marc}
                  alt="founder (Marc)"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  )
}

export default FounderSection

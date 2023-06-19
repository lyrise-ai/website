import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import { ImgComponent } from '../shared/ImageComponent/ImageComponent'

const SilverbulletGray = '/assets/GrayLogos/silver_bulletgray.png'
const QuantraxGray = '/assets/GrayLogos/quantraxgray.png'
const BrimoreGray = '/assets/GrayLogos/brimoregray.png'
const NeoTaxGray = '/assets/GrayLogos/neotaxgray.png'
const RushGray = '/assets/GrayLogos/rushgray.png'
const LinumGray = '/assets/GrayLogos/linumgray.png'
const Silverbullet = '/assets/Logos/silver_bullet.png'
const Quantrax = '/assets/Logos/quantrax.png'
const Brimore = '/assets/Logos/brimore.png'
const NeoTax = '/assets/Logos/neotax.png'
const Rush = '/assets/Logos/rush.png'
const Linum = '/assets/Logos/linum.png'

const FooterMobile = ({ step }) => {
  return (
    <Grid container justifyContent="center">
      <Grid item sx={{ marginBottom: '37px', fontSize: '16px' }}>
        Join our top partners
      </Grid>
      <Grid item container direction="row" justifyContent="space-between">
        <Grid item xs={6} container direction="column" alignItems="center">
          <Grid item>
            <ImgComponent
              source={step !== 2 ? BrimoreGray : Brimore}
              width="100px"
              height="93px"
            />
          </Grid>
          <Grid item>
            <ImgComponent
              source={step !== 2 ? RushGray : Rush}
              width="100px"
              height="93px"
            />
          </Grid>
          <Grid item>
            <ImgComponent
              source={step !== 2 ? QuantraxGray : Quantrax}
              width="100px"
              height="93px"
            />
          </Grid>
        </Grid>
        <Grid item xs={6} container direction="column" alignItems="center">
          <Grid item>
            <ImgComponent
              source={step !== 2 ? LinumGray : Linum}
              width="100px"
              height="93px"
            />
          </Grid>
          <Grid item>
            <ImgComponent
              source={step !== 2 ? SilverbulletGray : Silverbullet}
              width="100px"
              height="93px"
            />
          </Grid>
          <Grid item>
            <ImgComponent
              source={step !== 2 ? NeoTaxGray : NeoTax}
              width="100px"
              height="93px"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

FooterMobile.propTypes = {
  step: PropTypes.number.isRequired,
}
export default FooterMobile

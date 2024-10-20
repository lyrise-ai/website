import { Grid } from '@mui/material'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'

import ArrowButton from '../../Buttons/ArrowButton'

export default function HeaderButtons() {
  return (
    <>
      <Grid item>
        <a href={LYRISEAI_PRODUCT_URL + 'talent/login'}>
          <ArrowButton
            variant="link"
            className="max-md:w-full justify-between font-medium py-3"
          >
            Apply As Talent
          </ArrowButton>
        </a>
      </Grid>
      {/* <Grid item>
        <a href={LYRISEAI_PRODUCT_URL + 'signup'}>
          <ArrowButton
            showArrow
            className="max-md:w-full justify-between font-medium py-3"
          >
            Find AI Talent
          </ArrowButton>
        </a>
      </Grid> */}
    </>
  )
}

import { Grid } from '@mui/material'
import { LYRISEAI_PRODUCT_URL } from '../../../constants/main'

import ArrowButton from '../../Buttons/ArrowButton'
import EastRoundedIcon from '@mui/icons-material/EastRounded'

export default function HeaderButtons() {
  return (
    <>
      <a
        href={LYRISEAI_PRODUCT_URL + 'talent/login'}
        target="_blank"
        rel="noopener noreferrer"
        class="group relative text-[14px] flex items-center gap-2 px-4 py-2 h-[36px] rounded-[4px] text-white bg-primary transition-colors hover:bg-primary/90"
      >
        {'Register Now'}
        <EastRoundedIcon className="transition-transform group-hover:translate-x-1 !size-6" />
      </a>
    </>
  )
}

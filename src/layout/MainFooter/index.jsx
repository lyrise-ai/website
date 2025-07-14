import { useMediaQuery } from '@mui/material'
import Main from './Main'
import MobileFooter from './MobileFooter'

function MainFooter() {
  const mobile = useMediaQuery('(max-width: 887px)')
  return <footer className="w-full h-full mt-auto">{<Main />}</footer>
}

export default MainFooter

import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { Divider, Grid, useMediaQuery } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  footerLinksOne,
  footerLinksTwo,
  footerLinksThree,
  headingEnum,
  footerLinks,
  footerLinksFour,
} from './FooterData'
import FooterColumn from './FooterColumn'
import Logo from '../../../assets/LyRiseLogo.png'
import { footer } from './style'
import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'

const MyFooter = styled.footer`
  padding-top: 70px;
  padding-left: 70px;
  padding-right: 70px;
  border-top: 1px solid #dadada;
  background-color: #ffffff;
`

const FooterMain = ({ isTalent }) => {
  const mobile = useMediaQuery('(max-width: 887px)')
  return (
    <div style={{ backgroundColor: '#FFF' }}>
      <MyFooter style={footer} className="container">
        <Grid
          container
          direction={mobile ? 'column' : 'row'}
          justifyContent="space-evenly"
          pb={2}
        >
          {/* first column */}
          <FooterColumn
            heading={headingEnum.EMPLOYERS}
            links={footerLinksOne}
          />
          {/* 2nd column */}
          <FooterColumn heading={headingEnum.TALENTS} links={footerLinksTwo} />
          {/* 3rd column - Form */}
          <FooterColumn
            heading={headingEnum.COMPANY}
            links={footerLinksThree}
          />
          {/* 3rd column - Form */}
          <FooterColumn
            heading={headingEnum.CONTACTS}
            links={footerLinksFour}
          />
          {/* 4th column - Form */}
          <Grid
            item
            xs={3}
            container
            direction="column"
            alignItems={mobile ? 'center' : 'flex-start'}
            justifyContent="space-between"
          >
            <Grid
              item
              xs={3}
              container
              direction="column"
              alignItems={mobile ? 'center' : 'flex-start'}
              // spacing={!mobile && '100px'}
              gap={!mobile && '100px'}
              justifyContent="space-between"
            >
              <Grid item>
                <ScheduleMeetingButton
                  location="FooterSection"
                  link={isTalent ? 'https://talents.lyrise.ai/' : '/Employer'}
                  text={isTalent ? 'Apply Now' : undefined}
                  eventType={isTalent ? 'PressedApplyNow' : undefined}
                  isTalent={false}
                />
              </Grid>
              <Grid
                item
                container
                direction="column"
                alignItems={mobile && 'center'}
              >
                <Grid item>
                  <Image src={Logo} />
                </Grid>
                <Grid
                  item
                  container
                  direction="row"
                  justifyContent={mobile && 'center'}
                  p={0}
                >
                  {footerLinks.map((link) => (
                    <Grid item key={link.id}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4D4361' }}
                      >
                        {link.icon}
                      </a>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        <Grid container direction="row" justifyContent="flex-end" pt={5}>
          <Grid item>
            <p style={{ color: '#4D4361', paddingBottom: '10px' }}>
              <Link href="/terms-conditions">Terms and Conditions</Link> /{' '}
              <Link href="/privacy-policy">Privacy Policy</Link> © Copyright
              LyRise 2022. All rights reserved.
            </p>
          </Grid>
        </Grid>
      </MyFooter>
    </div>
  )
}

export default FooterMain

FooterMain.propTypes = {
  isTalent: PropTypes.bool,
}

FooterMain.defaultProps = {
  isTalent: false,
}

// import styled from '@emotion/styled'
// import PropTypes from 'prop-types'
// import { Divider, Grid, useMediaQuery } from '@mui/material'
// import React from 'react'
// import Image from 'next/image'
// import {
//   footerLinksOne,
//   footerLinksTwo,
//   footerLinksThree,
//   headingEnum,
//   footerLinks,
// } from './FooterData'
// import FooterColumn from './FooterColumn'
// import Logo from '../../../assets/LyRise-logo.png'
// import { footer } from './style'
// import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'

// const MyFooter = styled.footer`
//   padding-top: 70px;
//   padding-left: 70px;
//   padding-right: 70px;
//   border-top: 1px solid #dadada;
//   background-color: #ffffff;
// `

// const FooterMain = ({ isTalent }) => {
//   const mobile = useMediaQuery('(max-width: 887px)')
//   return (
//     <MyFooter style={footer} className="container">
//       <Grid
//         container
//         direction={mobile ? 'column' : 'row'}
//         justifyContent="space-evenly"
//         pb={2}
//       >
//         {/* first column */}
//         <FooterColumn heading={headingEnum.EMPLOYERS} links={footerLinksOne} />
//         {/* 2nd column */}
//         <FooterColumn heading={headingEnum.TALENTS} links={footerLinksTwo} />
//         {/* 3rd column - Form */}
//         <FooterColumn heading={headingEnum.COMPANY} links={footerLinksThree} />
//         {/* 4th column - Form */}
//         <Grid
//           item
//           xs={3}
//           container
//           direction="column"
//           alignItems={mobile ? 'center' : 'flex-start'}
//           spacing={mobile ? 3 : 12}
//           justifyContent="space-between"
//         >
//           <Grid item>
//             <ScheduleMeetingButton
//               location="footer"
//               link={isTalent ? 'https://talents.lyrise.ai/' : '/calendar'}
//               text={isTalent ? 'Apply Now' : undefined}
//               eventType={isTalent ? 'PressedApplyNow' : undefined}
//             />
//           </Grid>
//           <Grid
//             item
//             container
//             direction="column"
//             alignItems={mobile && 'center'}
//           >
//             <Grid item>
//               <Image src={Logo} />
//             </Grid>
//             <Grid
//               item
//               container
//               direction="row"
//               justifyContent={mobile && 'center'}
//             >
//               {footerLinks.map((link) => (
//                 <Grid item key={link.id}>
//                   <a
//                     href={link.href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     style={{ color: '#4D4361' }}
//                   >
//                     {link.icon}
//                   </a>
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//       <Divider />
//       <Grid container direction="row" justifyContent="flex-end" pt={5}>
//         <Grid item>
//           <p style={{ color: '#4D4361', paddingBottom: '10px' }}>
//             Terms and Conditions / Privacy Policy © Copyright LyRise 2022. All
//             rights reserved.
//           </p>
//         </Grid>
//       </Grid>
//     </MyFooter>
//   )
// }

// export default FooterMain

// FooterMain.propTypes = {
//   isTalent: PropTypes.bool,
// }

// FooterMain.defaultProps = {
//   isTalent: false,
// }

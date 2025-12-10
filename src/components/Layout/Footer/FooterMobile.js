import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import React from 'react'
import Image from 'next/legacy/image'
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
import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'

const MyFooter = styled.footer`
  padding: 20px;
  border-top: 1px solid #dadada;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(9, 75, 246, 0.2) 0.01%,
    rgba(115, 124, 254, 0.2) 100%
  );
`

const FooterMobile = ({ isTalent }) => {
  return (
    <MyFooter>
      <div className="container">
        <Grid container direction="column" pb={2}>
          <Grid item>
            <Image src={Logo} width={130} />
          </Grid>
          <Grid item container direction="row" justifyContent="flex-start">
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
        <Grid container direction="column" justifyContent="flex-star">
          <Grid item container justifyContent="space-between">
            {/* first column */}
            <FooterColumn
              heading={headingEnum.EMPLOYERS}
              links={footerLinksOne}
            />
            {/* 2nd column */}
            <FooterColumn
              heading={headingEnum.TALENTS}
              links={footerLinksTwo}
            />
          </Grid>
          <Grid item container justifyContent="space-between">
            {/* 3rd column - Form */}
            <FooterColumn
              heading={headingEnum.COMPANY}
              links={footerLinksThree}
            />
            {/* 4th column - Form */}
            <FooterColumn
              heading={headingEnum.CONTACTS}
              links={footerLinksFour}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <ScheduleMeetingButton
            location="FooterSection"
            // link={isTalent ? 'https://talents.lyrise.ai/' : '/Employer'}
            link="https://meetings.hubspot.com/sales-lyrise"
            text={isTalent ? 'Apply Now' : undefined}
            eventType={isTalent ? 'PressedApplyNow' : undefined}
            isTalent={false}
          />
        </Grid>
      </div>
    </MyFooter>
  )
}

export default FooterMobile

FooterMobile.propTypes = {
  isTalent: PropTypes.bool,
}

FooterMobile.defaultProps = {
  isTalent: false,
}

// import styled from '@emotion/styled'
// import PropTypes from 'prop-types'
// import { Grid } from '@mui/material'
// import React from 'react'
// import Image from 'next/image'
// import {
//   footerLinksOne,
//   footerLinksTwo,
//   footerLinksThree,
//   headingEnum,
//   footerLinks,
//   footerLinksFour,
// } from './FooterData'
// import FooterColumn from './FooterColumn'
// import Logo from '../../../assets/LyRise-logo.png'
// import ScheduleMeetingButton from '../../Buttons/ScheduleMeetingButton'

// const MyFooter = styled.footer`
//   padding: 20px;
//   border-top: 1px solid #dadada;
//   background: linear-gradient(
//     180deg,
//     rgba(0, 0, 0, 0.2) 0%,
//     rgba(9, 75, 246, 0.2) 0.01%,
//     rgba(115, 124, 254, 0.2) 100%
//   );
// `

// const FooterMobile = ({ isTalent }) => {
//   return (
//     <MyFooter>
//       <div className="container">
//         <Grid container direction="column" pb={2}>
//           <Grid item>
//             <Image src={Logo} />
//           </Grid>
//           <Grid item container direction="row" justifyContent="flex-start">
//             {footerLinks.map((link) => (
//               <Grid item key={link.id}>
//                 <a
//                   href={link.href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{ color: '#4D4361' }}
//                 >
//                   {link.icon}
//                 </a>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>
//         <Grid container direction="column" justifyContent="flex-star">
//           <Grid item container justifyContent="space-between">
//             {/* first column */}
//             <FooterColumn
//               heading={headingEnum.EMPLOYERS}
//               links={footerLinksOne}
//             />
//             {/* 2nd column */}
//             <FooterColumn
//               heading={headingEnum.TALENTS}
//               links={footerLinksTwo}
//             />
//           </Grid>
//           <Grid item container justifyContent="space-between">
//             {/* 3rd column - Form */}
//             <FooterColumn
//               heading={headingEnum.COMPANY}
//               links={footerLinksThree}
//             />
//             <FooterColumn
//               heading={headingEnum.CONTACTS}
//               links={footerLinksFour}
//             />
//           </Grid>
//         </Grid>
//         {/* 3rd column - Form */}
//         <Grid item xs={12} container justifyContent="center">
//           <ScheduleMeetingButton
//             location="footer-mobile"
//             link={isTalent ? 'https://talents.lyrise.ai/' : '/calendar'}
//             text={isTalent ? 'Apply Now' : undefined}
//             eventType={isTalent ? 'PressedApplyNow' : undefined}
//           />
//         </Grid>
//       </div>
//     </MyFooter>
//   )
// }

// export default FooterMobile

// FooterMobile.propTypes = {
//   isTalent: PropTypes.bool,
// }

// FooterMobile.defaultProps = {
//   isTalent: false,
// }

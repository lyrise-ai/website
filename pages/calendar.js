import React from 'react'
import BookingPage from '../src/components/Booking/BookingPage'

export default function Calendar() {
  return <BookingPage />
}

// import Grid from '@mui/material/Grid'
// import Iframe from 'react-iframe'
// import amplitude from 'amplitude-js'
// import ReactGA from 'react-ga'

// function isHubspotEvent(e) {
//   return (
//     e.origin === 'https://meetings.hubspot.com' && e.data.meetingBookSucceeded
//   )
// }

// if (typeof window !== 'undefined') {
//   window.addEventListener(
//     'message',
//     function onSuccessfulBooking(e) {
//       if (isHubspotEvent(e) && process.env.NEXT_PUBLIC_ENV === 'production') {
//         amplitude.getInstance().logEvent('bookedAMeeting')
//         ReactGA.event({
//           category: 'Meeting',
//           action: 'bookedAMeeting',
//         })
//         window.dataLayer.push({
//           event: 'booked_a_meeting',
//           eventProps: {
//             category: 'Meeting',
//             action: 'bookedAMeeting',
//             label: 'booked_a_meeting_label',
//             value: 'success',
//           },
//         })
//         window.lintrk('track', { conversion_id: 10534057 })
//         window.removeEventListener('message', onSuccessfulBooking)
//       }
//     },
//     false,
//   )
// }

// export default function HubSpotCalendar() {
//   React.useEffect(() => {
//     if (
//       process.env.NEXT_PUBLIC_ENV === 'production' &&
//       typeof window !== 'undefined'
//     ) {
//       ReactGA.event({
//         category: 'Meeting',
//         action: 'PressedScheduleAMeeting',
//       })
//     }
//   }, [])

//   return (
//     <Grid
//       container
//       direction="column"
//       justifyContent="center"
//       alignItems="center"
//       style={{ height: '100vh', background: '#f5f8fa' }}
//     >
//       <Grid item xs={12} width="100%">
//         <Iframe
//           width="100%"
//           height="100%"
//           frameBorder="0"
//           url="https://meetings.hubspot.com/sales-lyrise"
//         />
//       </Grid>
//     </Grid>
//   )
// }

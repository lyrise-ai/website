// import React from 'react'
// import propTypes from 'prop-types'
// import {
//   getRemoteConfig,
//   getValue,
//   fetchAndActivate,
// } from 'firebase/remote-config'
// import { app } from '../../config/firebase'
// import remoteConfigDefaults from './remote_config_defaults.json'
// import { FirebaseProvider } from '../../context/FirebaseContext'

// export const FlagsProvider = ({ children }) => {
//   const [flag, setFlag] = React.useState(null)
//   const [loading, setLoading] = React.useState(true)

//   React.useEffect(() => {
//     async function fetchRemoteConfigValues() {
//       if (typeof window !== 'undefined') {
//         // for development purposes, we can set the default values
//         // remoteConfig.settings.minimumFetchIntervalMillis = 3600
//         try {
//           const remoteConfig = getRemoteConfig(app)
//           remoteConfig.defaultConfig = remoteConfigDefaults
//           await fetchAndActivate(remoteConfig)
//           let isPopup = await getValue(remoteConfig, 'popup')
//           isPopup = isPopup._value === 'true'
//           // console.log({ isPopup })
//           setFlag(isPopup)
//           setLoading(false)
//         } catch (error) {
//           setFlag(remoteConfigDefaults.popup)
//           setLoading(false)
//         }
//       }
//     }
//     fetchRemoteConfigValues()
//   }, [])

//   if (loading) return null

//   return <FirebaseProvider value={flag}>{children}</FirebaseProvider>
// }

// FlagsProvider.propTypes = {
//   children: propTypes.node.isRequired,
// }

import amplitude from 'amplitude-js'

const options = { includeReferrer: true, includeUtm: true }

export const initAmplitude = () => {
  amplitude.getInstance().init(process.env.NEXT_PUBLIC_AMPLITUDE, null, options)
}

export const setAmplitudeUserDevice = (installationToken) => {
  amplitude.getInstance().setDeviceId(installationToken)
}

export const setAmplitudeUserId = (userId) => {
  amplitude.getInstance().setUserId(userId)
}

export const setAmplitudeUserProperties = (properties) => {
  amplitude.getInstance().setUserProperties(properties)
}

export const sendAmplitudeData = (eventType, eventProperties) => {
  amplitude.getInstance().logEvent(eventType, eventProperties)
}

import axios from 'axios'

import axiosRetry from 'axios-retry'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  timeout: 1000 * 60 * 60 * 24 * 365,
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
})

instance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

axiosRetry(instance, { retries: 5, retryDelay: axiosRetry.exponentialDelay })

export default instance

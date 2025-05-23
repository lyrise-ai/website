import axios from 'axios'

// the leaderboard accelerator is only working on test backend
// so we don't use api instance here and use a custom one

const api = axios.create({
  baseURL: 'https://test-chat.lyrise.ai/api',
  headers: {
    common: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

/**
 * Get all companies in the leaderboard
 * @returns {Promise<Array>} List of companies
 */
export async function getLeaderboard() {
  try {
    const response = await api.get('/leaderboard/')
    return response.companies
  } catch (error) {
    window.alert(error.response?.data?.error || 'Failed to get leaderboard')
    return []
  }
}

/**
 * Register a new company in the leaderboard
 * @param {Object} data Company data
 * @param {string} data.name Company name
 * @param {string} data.industry Company industry
 * @param {string} data.size Company size
 * @returns {Promise<string>} Created company ID
 */
export async function registerCompany(data) {
  try {
    return await api.post('/leaderboard/', data)
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || 'Failed to register company'
    throw new Error(errorMessage)
  }
}

/**
 * Vote for a company
 * @param {string} companyId Company ID to vote for
 * @returns {Promise<void>}
 */
export async function voteForCompany(companyId) {
  try {
    await api.post(`/leaderboard/${companyId}/vote`)
  } catch (error) {
    window.alert(error.response?.data?.error || 'Failed to vote')
  }
}

/**
 * Remove vote from a company
 * @param {string} companyId Company ID to remove vote from
 * @returns {Promise<void>}
 */
export async function downvoteCompany(companyId) {
  try {
    await api.delete(`/leaderboard/${companyId}/vote`)
  } catch (error) {
    window.alert(error.response?.data?.error || 'Failed to downvote')
  }
}

/**
 * Set user email for authentication
 * @param {string} email User's email
 */
export function setAPIXUserEmailHeader(email) {
  api.defaults.headers.common['X-User-Email'] = email
}

import api from './api.services'

/**
 * Get all companies in the leaderboard
 * @returns {Promise<Array>} List of companies
 */
export async function getLeaderboard() {
  try {
    const response = await api.get('/leaderboard/')
    return response.companies
  } catch (error) {
    console.log(error)
    throw new Error(
      error.response?.data?.error || 'Failed to fetch leaderboard',
    )
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
    console.log(error)
    throw new Error(error.response?.data?.error || 'Failed to register company')
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
    throw new Error(error.response?.data?.error || 'Failed to vote for company')
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
    throw new Error(error.response?.data?.error || 'Failed to remove vote')
  }
}

/**
 * Set user email for authentication
 * @param {string} email User's email
 */
export function setAPIXUserEmailHeader(email) {
  api.defaults.headers.common['X-User-Email'] = email
}

import api from './api.services'

export const employerSignUp = async (data) =>
  api.post('/v1/employer/landing-signup', data)

export const employerSurvey = async (data) =>
  api.post('/v1/employer/survey', data)

export const employerIncompleteSignup = async (data) =>
  api.post('/v1/employer/incompleted', data)

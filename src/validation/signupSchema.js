import * as yup from 'yup'

export const signupSchema = yup
  .object({
    name: yup.string().trim().required('Name is required'),
    email: yup.string().email().trim().required('Email is required'),
    companyName: yup.string().trim().required('Company Name is required'),
    talent: yup.string().trim().required('This field is required'),
  })
  .required()

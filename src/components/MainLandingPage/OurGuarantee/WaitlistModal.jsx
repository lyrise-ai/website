import { Field, Form, Formik } from 'formik'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import * as Yup from 'yup'
import {
  Button,
  Modal,
  Box,
  Fade,
  Backdrop,
  TextField,
  Typography,
  IconButton,
} from '@mui/material'

// Validation schema using Yup
const WaitlistSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  company: Yup.string().required('Company is required'),
  mobile: Yup.string().required('Mobile number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  message: Yup.string().required('Please tell us how we can help you'),
})

export function WaitlistModal({
  triggerLabel = 'Join Waitlist',
  triggerClassName = '',
  showIcon = false,
  children = null,
}) {
  const [openModal, setOpenModal] = useState(false)

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: 24,
    p: { xs: 3, sm: 4 },
    fontFamily: 'Outfit, sans-serif',
    fontSize: { xs: '0.9rem', sm: '1rem' },
  }

  function onCloseModal() {
    setOpenModal(false)
  }

  return (
    <>
      {children ? (
        <div onClick={() => setOpenModal(true)}>{children}</div>
      ) : (
        <div
          onClick={() => setOpenModal(true)}
          className={`group w-fit  flex items-center gap-2 px-5 py-2 cursor-pointer rounded-[4px] text-white  ${triggerClassName}`}
        >
          {triggerLabel}
          {showIcon && (
            <ArrowForwardIcon className="transition-transform group-hover:translate-x-1 !size-6" />
          )}
        </div>
      )}

      <Modal
        open={openModal}
        onClose={onCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={openModal}>
          <Box sx={modalStyle}>
            <IconButton
              aria-label="close"
              onClick={onCloseModal}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Typography
              variant="h6"
              component="h3"
              mb={2}
              fontWeight={600}
              sx={{
                fontFamily: 'Outfit, sans-serif',
                color: '#1f2937',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              Let&apos;s get in touch!
            </Typography>

            <Formik
              initialValues={{
                name: '',
                company: '',
                mobile: '',
                email: '',
                message: '',
              }}
              validationSchema={WaitlistSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const formData = new FormData()
                formData.append('name', values.name)
                formData.append('company', values.company)
                formData.append('mobile', values.mobile)
                formData.append('email', values.email)
                formData.append('message', values.message)

                try {
                  // If your GAS doesn’t send CORS headers, use no-cors and don’t parse JSON.
                  await fetch(
                    'https://script.google.com/macros/s/AKfycbyFt8RV6QcAAU9YfAMa6vXGennqnpm3nAD1cICeS0vI_1mfjBIyimpMmMz97LYhOYU5/exec',
                    {
                      method: 'POST',
                      body: formData,
                      mode: 'no-cors',
                      keepalive: true, // lets request finish even if page navigates
                    },
                  )
                } catch (e) {
                  console.error(e)
                } finally {
                  resetForm()
                  setSubmitting(false)
                  onCloseModal()
                  // Same-tab redirect is not treated as a popup:
                  window.location.assign(
                    'https://calendly.com/elena-lyrise/30min',
                  )
                }
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="name"
                    name="name"
                    label="Name"
                    margin="dense"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#d1d5db' },
                        '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                      },
                    }}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="company"
                    name="company"
                    label="Company"
                    margin="dense"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#d1d5db' },
                        '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                      },
                    }}
                    error={touched.company && Boolean(errors.company)}
                    helperText={touched.company && errors.company}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="mobile"
                    name="mobile"
                    label="Mobile Number"
                    margin="dense"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#d1d5db' },
                        '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                      },
                    }}
                    error={touched.mobile && Boolean(errors.mobile)}
                    helperText={touched.mobile && errors.mobile}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    margin="dense"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#d1d5db' },
                        '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                      },
                    }}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="message"
                    name="message"
                    label="How can we help you?"
                    multiline
                    rows={3}
                    margin="dense"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: '#f9fafb',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        '& fieldset': { borderColor: '#e5e7eb' },
                        '&:hover fieldset': { borderColor: '#d1d5db' },
                        '&.Mui-focused fieldset': { borderColor: '#4f46e5' },
                      },
                    }}
                    error={touched.message && Boolean(errors.message)}
                    helperText={touched.message && errors.message}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      mt: 2,
                      height: '52px',
                      color: 'white',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 600,
                      backgroundColor: '#000',
                      '&:hover': { backgroundColor: '#111' },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                        color: '#666',
                        cursor: 'not-allowed',
                      },
                    }}
                  >
                    {isSubmitting ? 'Loading...' : 'Book a Meeting'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Fade>
      </Modal>
    </>
  )
}

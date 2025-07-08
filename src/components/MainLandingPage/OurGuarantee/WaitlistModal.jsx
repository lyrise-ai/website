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
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .test('is-business-email', 'Please use a business email', (value) => {
      if (!value) return false
      // Common personal email domains to exclude
      const personalDomains = [
        'gmail.com',
        'yahoo.com',
        'hotmail.com',
        'outlook.com',
        'aol.com',
        'icloud.com',
        'protonmail.com',
        'mail.com',
        'zoho.com',
      ]
      const domain = value.split('@')[1]
      return !personalDomains.includes(domain)
    }),
})

export function WaitlistModal({
  triggerLabel = 'Join Waitlist',
  triggerClassName = '',
  showIcon = true,
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
      <div
        onClick={() => setOpenModal(true)}
        className={`group w-fit  flex items-center gap-2 px-5 py-2 cursor-pointer rounded-[4px] text-white  ${triggerClassName}`}
      >
        {triggerLabel}
        {showIcon && (
          <ArrowForwardIcon className="transition-transform group-hover:translate-x-1 !size-6" />
        )}
      </div>

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
              Let&apos;s get in touch
            </Typography>

            <Formik
              initialValues={{ firstName: '', lastName: '', email: '' }}
              validationSchema={WaitlistSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                const formData = new FormData()
                formData.append('first_name', values.firstName)
                formData.append('last_name', values.lastName)
                formData.append('email', values.email)

                fetch(
                  'https://script.google.com/macros/s/AKfycbzzaZRCfgzXPzt2Hs5BK_BctBhTvZhTuwE4CmdZe5IeVgJ39DEX5QgY6hOsmawWcCYx/exec',
                  {
                    method: 'POST',
                    body: formData,
                  },
                )
                  .then((res) => res.json())
                  .then(() => {
                    setSubmitting(false)
                    resetForm()
                    onCloseModal()
                  })
                  .catch((err) => console.log(err))
              }}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="firstName"
                    name="firstName"
                    label="First Name"
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
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={touched.firstName && errors.firstName}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="lastName"
                    name="lastName"
                    label="Last Name"
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
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={touched.lastName && errors.lastName}
                  />

                  <Field
                    as={TextField}
                    fullWidth
                    size="small"
                    id="email"
                    name="email"
                    label="Business Email"
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
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
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

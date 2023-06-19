/* eslint-disable sonarjs/no-identical-functions */
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { signupSchema } from '../../../validation/signupSchema'
import * as api from '../../../services/employer.services'
import MyTypography from '../../shared/FormPopup/MyTypography'
import styles from '../../shared/FormPopup/FormPopup.module.css'

const defaultValues = {
  name: '',
  email: '',
  companyName: '',
  talent: '',
}

const SignupForm = () => {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const { pathname } = useRouter()
  const messagePosition = 'bottom-left'

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(signupSchema),
  })

  const onSubmitHandler = async (signupData) => {
    try {
      await api.employerSignUp(signupData)
      toast.success('Successfully signed up!', {
        position: messagePosition,
      })
      const eventProperties = {
        page: pathname,
        section: 'hero-section',
      }
      if (process.env.NEXT_PUBLIC_ENV === 'production') {
        amplitude
          .getInstance()
          .logEvent('completedSignupInline', eventProperties)
        ReactGA.event({
          category: 'employerLandingSignup',
          action: 'completedSignupInline',
        })
      }
      reset({ name: '', email: '', companyName: '', talent: '' })
    } catch (e) {
      if (e?.response && e.response?.data?.message) {
        toast.error(e?.response?.data?.message, {
          position: messagePosition,
        })
      } else {
        toast.error(e?.data?.message, {
          position: messagePosition,
        })
      }
    }
  }

  return (
    <Grid container direction="column" gap={5}>
      <Grid
        item
        container
        direction="row"
        gap="20px"
        wrap={mobile ? undefined : 'nowrap'}
        style={{ padding: '0' }}
      >
        <Grid container item xs={mobile ? 12 : 6} direction="column" gap="12px">
          <Grid item>
            <MyTypography>Your Name</MyTypography>
          </Grid>
          <Grid item>
            <Controller
              name="name"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth={mobile ? true : undefined}
                  sx={{
                    width: mobile ? undefined : '242px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      height: '52px',
                    },
                  }}
                  placeholder="ex:Khaled"
                  inputProps={{
                    style: {
                      fontSize: '14px',
                      padding: '12px 12px',
                    },
                  }}
                  variant="outlined"
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container item xs={mobile ? 12 : 6} direction="column" gap="12px">
          <Grid item>
            <MyTypography>Your E-Mail</MyTypography>
          </Grid>
          <Grid item>
            <Controller
              name="email"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth={mobile ? true : undefined}
                  sx={{
                    width: mobile ? undefined : '242px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      height: '52px',
                    },
                  }}
                  placeholder="ex:Khaled@lyrise.com"
                  inputProps={{
                    style: {
                      fontSize: '14px',
                      padding: '12px 12px',
                    },
                  }}
                  variant="outlined"
                  helperText={error ? error.message : null}
                  error={!!error}
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container direction="column" gap="12px">
        <Grid item>
          <MyTypography>Company Name</MyTypography>
        </Grid>
        <Grid item>
          <Controller
            name="companyName"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    height: '52px',
                  },
                }}
                placeholder="ex:Apple"
                inputProps={{
                  style: {
                    fontSize: '14px',
                    padding: '12px 12px',
                  },
                }}
                variant="outlined"
                helperText={error ? error.message : null}
                error={!!error}
                onChange={onChange}
                value={value}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid item container direction="column" gap="12px">
        <Grid item>
          <MyTypography>Who are you looking to hire</MyTypography>
        </Grid>
        <Grid item>
          <Controller
            name="talent"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <Autocomplete
                  value={value}
                  options={[
                    'Data Scientist',
                    'AI Engineer',
                    'NLP',
                    'ML Engineer',
                    'Computer Vision Engineer',
                    'Software Engineer',
                  ]}
                  fullWidth
                  onChange={(e, newValue) => {
                    onChange(newValue)
                  }}
                  sx={{
                    '& .MuiAutocomplete-endAdornment': {
                      top: '5px',
                      position: 'absolute',
                    },
                    '& .MuiAutocomplete-input': {
                      padding: '6px 6px !important',
                    },
                    '& .MuiAutocomplete-inputRoot': {
                      fontSize: '14px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      height: '52px',
                    },
                  }}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      placeholder="ex:Data scientist"
                      error={!!error}
                      inputProps={{
                        style: {
                          padding: '0px !important',
                        },
                      }}
                      helperText={error ? error.message : null}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...params}
                      variant="outlined"
                    />
                  )}
                />
              )
            }}
          />
        </Grid>
      </Grid>
      <Grid item alignSelf="flex-end">
        <Button
          disableElevation
          variant="contained"
          sx={{
            width: '16.875rem',
            height: '65px',
            border: '1px solid',
            borderRadius: '8px',
            padding: '13px 24px',
            textTransform: 'none',
            background:
              'linear-gradient(94.63deg, #094BF6 8.53%, #8282FF 107.57%)',
          }}
          // style={{
          //   width: smallScreen && '100% !important',
          //   textAlign: mobile && 'center',
          // }}
          onClick={handleSubmit(onSubmitHandler)}
        >
          <Typography className={styles.form__button}>Submit</Typography>
        </Button>
      </Grid>
    </Grid>
  )
}

export default SignupForm

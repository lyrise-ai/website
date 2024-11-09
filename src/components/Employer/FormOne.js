/* eslint-disable no-console */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Autocomplete,
  FormControl,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import PropTypes from 'prop-types'
import { MuiTelInput } from 'mui-tel-input'
import styled from '@emotion/styled'
import { Controller, useForm } from 'react-hook-form'
import Image from "next/legacy/image"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import CloseIcon from '@mui/icons-material/Close'
import { useRouter } from 'next/router'
import FormWrapper from './FormWrapper'
import ErrorMessage from '../shared/ErrorMessage/ErrorMessage'
import MyTypography from '../shared/FormPopup/MyTypography'
import SearchIcon from '../../assets/searchIcon.svg'
import TickCircle from '../../assets/tickCircle.svg'
import BasicTabs from '../shared/BasicTabs/BasicTabs'
import { useFormData } from './FormContext/FormContext'
import PrimaryButton from '../shared/PrimaryButton/PrimaryButton'
import { EmployerSkills } from '../../constants/EmployerContstants'
import * as api from '../../services/employer.services'

const skillOptionSchema = yup.object({
  label: yup.string().required(),
  value: yup.string().required(),
})

const schema = yup.object({
  name: yup.string().trim().required('Name is required'),
  email: yup.string().trim().email().required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  skills: yup.array(skillOptionSchema).min(1, 'Required').required('Required'),
})

// eslint-disable-next-line sonarjs/cognitive-complexity
export default function FormOne({ handleNext }) {
  const under678 = useMediaQuery('(max-width: 678px)')
  const under500 = useMediaQuery('(max-width: 500px)')
  const { pathname } = useRouter()
  const { changeFormOne, formOne } = useFormData()

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: { ...formOne },
    resolver: yupResolver(schema),
  })

  const onSubmit = async (values) => {
    changeFormOne(values)
    // send amplitude events
    const eventProperties = {
      section: 'employer-form-one',
      page: pathname,
    }
    if (process.env.NEXT_PUBLIC_ENV === 'production') {
      amplitude.getInstance().logEvent('CompletedFormOne', eventProperties)
      ReactGA.event({
        category: 'EmployerSignupViewOne',
        action: 'CompletedFormOne',
      })
    }
    const jobType = values?.jobType === 1 ? 'Part Time' : 'Full Time'
    const skills = values.skills.map((skill) => skill.value)
    try {
      await api.employerIncompleteSignup({ ...values, skills, jobType })
      handleNext()
    } catch (e) {
      console.log(e)
      handleNext()
    }
  }

  const PhoneGrid = styled(Grid)`
    & .MuiFormControl-root {
      width: 100%;
    }
  `
  const MuiTelComp = styled(MuiTelInput)`
    & .MuiInputBase-root {
      height: 52px;
      width: 100%;
    }

    & input {
      font-size: 16px;
      font-family: 'Poppins';
      line-height: 120%;
    }
  `

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper
          title="Tell Us The Skills You Are Looking For."
          header="Tell us what you need."
        >
          <Grid
            item
            container
            gap={2}
            wrap="nowrap"
            direction={under500 ? 'column' : 'row'}
          >
            {/* first row  */}
            <Grid xs={under500 ? 12 : 6} item container direction="column">
              <Grid item mb="10px">
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '16px',
                    lineHeight: '140%',
                    color: '#475569',
                    width: '100%',
                  }}
                >
                  Full Name*
                </Typography>
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
                      onChange={onChange}
                      value={value}
                      placeholder="ex:Khaled"
                      defaultValue={formOne?.email}
                      error={!!error}
                      style={{
                        minWidth: '100%',
                        backgroundColor: 'white',
                      }}
                      sx={{ input: { fontSize: '14px' } }}
                    />
                  )}
                />
                {errors?.name ? (
                  <ErrorMessage message={errors.name.message} />
                ) : undefined}
              </Grid>
            </Grid>
            <Grid xs={under500 ? 12 : 6} item container direction="column">
              <Grid item mb="10px">
                <MyTypography>Phone Number*</MyTypography>
              </Grid>
              <PhoneGrid item sx={{ background: '#fff' }}>
                <Controller
                  name="phone"
                  control={control}
                  // defaultValue={formOne?.phone}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <MuiTelComp
                        onChange={onChange}
                        value={value}
                        error={!!error}
                        forceCallingCode
                        focusOnSelectCountry
                        preferredCountries={['US', 'GB']}
                        flagSize="medium"
                        MenuProps={{ disableAutoFocusItem: true }}
                        defaultCountry="US"
                      />
                    </>
                  )}
                />
              </PhoneGrid>
              {errors.phone ? (
                <ErrorMessage message={errors?.phone?.message} />
              ) : null}
            </Grid>
          </Grid>
          {/* second row */}
          <Grid
            item
            container
            gap={2}
            wrap="nowrap"
            justifyContent="space-between"
            direction={under500 ? 'column' : 'row'}
          >
            <Grid xs={under500 ? 12 : 6} item container direction="column">
              <Grid item mb="10px">
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '16px',
                    lineHeight: '140%',
                    color: '#475569',
                  }}
                >
                  Email*
                </Typography>
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
                      onChange={onChange}
                      value={value}
                      placeholder="ex:Khaled@lyrise.ai"
                      defaultValue={formOne?.email}
                      error={!!error}
                      style={{
                        minWidth: '100%',
                        backgroundColor: 'white',
                      }}
                      sx={{ input: { fontSize: '14px' } }}
                    />
                  )}
                />
                {errors?.email ? (
                  <ErrorMessage message={errors.email.message} />
                ) : null}
              </Grid>
            </Grid>
            <Grid
              xs={6}
              item
              container
              direction={under500 ? 'row' : 'column'}
              alignItems={under500 ? 'center' : undefined}
            >
              <Grid xs={under500 ? 4 : undefined} item mb="10px">
                <MyTypography>Job type*</MyTypography>
              </Grid>
              <Grid item xs={under500 ? 8 : undefined}>
                <Controller
                  name="jobType"
                  control={control}
                  defaultValue={formOne?.jobType}
                  render={({ field: { onChange, value } }) => (
                    <BasicTabs
                      tab1Label="Full Time"
                      tab2Label="Part Time"
                      onChange={onChange}
                      value={value}
                      setParentState={changeFormOne}
                      tabsName="jobType"
                      defaultValue={formOne?.jobType}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* third row */}
          <Grid item container gap={2} wrap="nowrap">
            {/* skills */}
            <Grid item container direction="column">
              <Grid item mb="8px">
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    fontSize: '16px',
                    lineHeight: '140%',
                    color: '#475569',
                  }}
                >
                  Select the skills you need*
                </Typography>
              </Grid>
              <Grid item container direction="column" mb="32px">
                <Grid item>
                  <FormControl
                    sx={{
                      // height: '52px',
                      width: '100%',
                      backgroundColor: 'white',
                    }}
                  >
                    {' '}
                    <Controller
                      name="skills"
                      control={control}
                      defaultValue={formOne?.skills}
                      rules={{ required: true }}
                      render={({
                        field: { onChange },
                        fieldState: { error },
                      }) => (
                        <Autocomplete
                          onChange={(event, item) => {
                            changeFormOne({
                              skills: [...item],
                            })
                            onChange(item)
                          }}
                          value={formOne?.skills}
                          disableClearable
                          multiple
                          options={EmployerSkills}
                          disableCloseOnSelect
                          sx={{
                            '& .MuiAutocomplete-inputRoot': {
                              minHeight: '52px !important',
                              height: 'auto',
                              width: '100%',
                            },
                          }}
                          ListboxProps={{
                            sx: {
                              maxHeight: '200px',
                            },
                          }}
                          renderTags={(selectedValues, getTagProps) =>
                            selectedValues.map((clickedOption, index) => (
                              <div
                                {...getTagProps({ index })}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  gap: '4px',
                                  background: ' rgba(7, 62, 205, 0.05)',
                                  borderRadius: '12px',
                                  margin: '4px',
                                }}
                              >
                                <Image src={TickCircle} alt="tick" />
                                <Typography
                                  sx={{
                                    fontFamily: 'Poppins',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '12px',
                                    lineHeight: '18px',
                                    color: '#073ECD',
                                  }}
                                >
                                  {clickedOption.label}
                                </Typography>
                                <div
                                  style={{
                                    alignSelf: 'flex-end',
                                    cursor: 'pointer',
                                    color: 'grey',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                  onClick={() => {
                                    const newSkillsAfterDelete =
                                      selectedValues.filter(
                                        (skill) =>
                                          skill?.label !== clickedOption?.label,
                                      )
                                    onChange(newSkillsAfterDelete)
                                    changeFormOne({
                                      skills: [
                                        ...new Set(newSkillsAfterDelete),
                                      ],
                                    })
                                  }}
                                >
                                  <CloseIcon
                                    sx={{
                                      fontSize: '16px',
                                      borderRadius: '50%',
                                      padding: '2px',
                                      '&:hover': {
                                        backgroundColor: 'white',
                                      },
                                    }}
                                  />
                                </div>
                              </div>
                            ))
                          }
                          getOptionSelected={(option, val) =>
                            option.label === val.label
                          }
                          getOptionLabel={(option) => option.label}
                          // filterSelectedOptions
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                // width: under678 ? '100%' : '640px',
                                backgroundColor: 'white',
                                minHeight: '52px',
                                width: '100%',
                              }}
                              {...params}
                              placeholder="ex:Python"
                              error={!!error}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    {params.InputProps.startAdornment}
                                    <Image src={SearchIcon} alt="tick" />
                                  </>
                                ),
                                sx: {
                                  '& .MuiInputBase-input': {
                                    fontFamily: 'Poppins',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '16px',
                                    lineHeight: '18px',
                                    color: '#94A3B8',
                                  },
                                  '& .MuiInputBase-input::placeholder': {
                                    fontFamily: 'Poppins',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '16px',
                                    lineHeight: '18px',
                                    color: '#94A3B8',
                                  },
                                  '& .MuiInputBase-input::-webkit-input-placeholder':
                                    {
                                      fontFamily: 'Poppins',
                                      fontStyle: 'normal',
                                      fontWeight: '400',
                                      fontSize: '16px',
                                      lineHeight: '18px',
                                      color: '#94A3B8',
                                    },
                                  '& .MuiInputBase-input::-moz-placeholder': {
                                    fontFamily: 'Poppins',
                                    fontStyle: 'normal',
                                    fontWeight: '400',
                                    fontSize: '16px',
                                    lineHeight: '18px',
                                    color: '#94A3B8',
                                  },
                                },
                              }}
                            />
                          )}
                          renderOption={(props, option) => {
                            const checked = formOne?.skills?.find(
                              (skill) => skill.label === option.label,
                            )
                            //! style the options
                            return (
                              <div
                                {...props}
                                style={{
                                  color: '#004EEB',
                                  fontSize: '16px',
                                  fontFamily: 'Poppins',
                                  lineHeight: '19px',
                                  height: '38px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  ...(checked && {
                                    backgroundColor: '#EFF4FF',
                                    pointerEvent: 'none',
                                  }),
                                }}
                              >
                                <Image
                                  width="20px"
                                  height="40px"
                                  src={
                                    !checked
                                      ? '/images/nontickCircle.svg'
                                      : '/images/tickCircle.svg'
                                  }
                                  alt={checked ? 'tick' : 'empty circle'}
                                  style={{ maxWidth: '100%' }}
                                />
                                {option.label}
                              </div>
                            )
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  <p>
                    {errors?.skills ? (
                      <ErrorMessage message={errors?.skills.message} />
                    ) : null}
                  </p>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            maxWidth="640px !important"
            gap={under678 ? 2 : undefined}
          >
            <Grid
              item
              justifyContent={under500 ? 'center' : undefined}
              container
              mr={!under678 ? '14px' : undefined}
            >
              <PrimaryButton
                text="Continue"
                type="submit"
                isValid={isValid}
                styles={{ width: under500 ? '100% !important' : '175px' }}
              />
            </Grid>
          </Grid>
        </FormWrapper>
      </form>
    </>
  )
}

FormOne.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handlePrevious: PropTypes.func.isRequired,
}

FormOne.defaultProps = {}

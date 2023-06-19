/* eslint-disable no-console */
/* eslint-disable react/jsx-no-duplicate-props */
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  FormControl,
  Grid,
  // InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import amplitude from 'amplitude-js'
import ReactGA from 'react-ga'
import { useRouter } from 'next/router'
// import Image from 'next/image'
// import { toast } from 'react-toastify'
// import ArrowDown from '../../assets/SelectArrowDown.svg'
import BasicTabs from '../shared/BasicTabs/BasicTabs'
import ErrorMessage from '../shared/ErrorMessage/ErrorMessage'
import MyTypography from '../shared/FormPopup/MyTypography'
import { useFormData } from './FormContext/FormContext'
import FormWrapper from './FormWrapper'
import PrimaryButton from '../shared/PrimaryButton/PrimaryButton'
import SecondaryButton from '../shared/SecondaryButton/SecondaryButton'
import { EmployerNumOfEmployees } from '../../constants/EmployerContstants'
import * as api from '../../services/employer.services'

const schema = yup.object({
  companyName: yup.string().required('Required'),
  employees: yup.string().required('Required'),
})
// eslint-disable-next-line sonarjs/cognitive-complexity
export default function FormTwo({ handleNext, handlePrevious }) {
  const under678 = useMediaQuery('(max-width: 678px)')
  const under500 = useMediaQuery('(max-width: 500px)')

  const { pathname } = useRouter()
  const { formOne, changeFormTwo, formTwo } = useFormData()

  const {
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    mode: 'all',
    defaultValues: { ...formTwo },
    resolver: yupResolver(schema),
  })

  const onSubmit = async (values) => {
    changeFormTwo(values)
    try {
      let formData = { ...formOne, ...formTwo }
      const isFunded = formData?.isFunded === 1 ? 'No' : 'Yes'
      const jobType = formData?.jobType === 1 ? 'Part Time' : 'Full Time'
      const skills = formData.skills.map((skill) => skill.value)
      formData = { ...formData, isFunded, jobType, skills }
      api.employerSurvey(formData)
      if (process.env.NEXT_PUBLIC_ENV === 'production') {
        const eventProperties = {
          section: 'employer-form-two',
          page: pathname,
        }
        amplitude.getInstance().logEvent('CompletedFormTwo', eventProperties)
        ReactGA.event({
          category: 'EmployerSignupViewTwo',
          action: 'CompletedFormTwo',
        })
      }
      handleNext()
    } catch (e) {
      console.log(e)
      handleNext()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormWrapper
        title="Tell us more about your company."
        header="Tell us what you need."
      >
        <Grid item container gap={2} wrap={under500 ? 'wrap' : 'nowrap'}>
          {/* first row  */}
          {/* name */}
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
                Company Name*
              </Typography>
            </Grid>
            <Grid item>
              <Controller
                name="companyName"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    placeholder="ex: Apple"
                    defaultValue={formTwo?.companyName}
                    value={value}
                    onChange={(e) => {
                      changeFormTwo({ companyName: e.target.value })
                      onChange(e.target.value)
                    }}
                    error={!!error}
                    style={{
                      minWidth: '100%',
                      backgroundColor: 'white',
                    }}
                    sx={{ input: { fontSize: '14px' } }}
                  />
                )}
              />
              {errors?.companyName ? (
                <ErrorMessage message={errors.companyName.message} />
              ) : undefined}
            </Grid>
          </Grid>
          <Grid xs={under500 ? 12 : 6} item container direction="column">
            <Grid item mb="10px">
              <MyTypography>Company Website</MyTypography>
            </Grid>
            <Controller
              name="companyWebsite"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  placeholder="ex: Apple.com"
                  defaultValue={formTwo?.companyWebsite}
                  value={value}
                  onChange={(e) => {
                    changeFormTwo({ companyWebsite: e.target.value })
                    onChange(e.target.value)
                  }}
                  error={!!error}
                  style={{
                    minWidth: '100%',
                    backgroundColor: 'white',
                  }}
                  sx={{ input: { fontSize: '14px' } }}
                />
              )}
            />
            {errors?.companyWebsite ? (
              <ErrorMessage message={errors.companyWebsite.message} />
            ) : undefined}
          </Grid>
        </Grid>
        {/* second row */}
        <Grid
          item
          container
          gap={under500 ? undefined : 2}
          wrap={under500 ? 'wrap' : 'nowrap'}
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={under500 ? 6 : 8} item container direction="column">
            <MyTypography>
              Are you Seed or Venture Capital funded ?
            </MyTypography>
          </Grid>
          <Grid xs={under500 ? 6 : 4} item container direction="column">
            <Grid item mb="10px">
              <Controller
                name="isFunded"
                control={control}
                defaultValue={formTwo?.isFunded}
                render={({ field: { onChange, value } }) => (
                  <BasicTabs
                    tab1Label="Yes"
                    tab2Label="No"
                    onChange={onChange}
                    value={value}
                    setParentState={changeFormTwo}
                    tabsName="isFunded"
                    defaultValue={formTwo?.isFunded}
                  />
                )}
              />

              {errors?.isFunded ? (
                <ErrorMessage message={errors.isFunded.message} />
              ) : undefined}
            </Grid>
          </Grid>
        </Grid>
        <Grid item container gap={2} wrap="nowrap">
          {/* No of Employees */}
          <Grid
            item
            container
            direction="column"
            mb="32px"
            xs={under500 ? 12 : 6}
          >
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
                Number of Employees*
              </Typography>
            </Grid>
            <Grid item container direction="column">
              <Grid item>
                <FormControl
                  sx={{
                    // height: '52px',
                    width: '100%',
                    backgroundColor: 'white',
                    maxWidth: under500 ? '100%' : '275px',
                  }}
                >
                  <Controller
                    name="employees"
                    defaultValue={formTwo?.employees}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <Select
                        sx={{
                          height: '52px',
                          fontSize: '16px',
                          backgroundColor: '#FFF',
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#FFF',
                              '& .MuiMenuItem-root': {
                                padding: 1,
                                fontSize: '14px',
                                fontFamily: 'Poppins',
                                lineHeight: '19px',
                                height: '38px',
                                color: '#073ECD',
                              },
                              '& .Mui-selected': {
                                backgroundColor: '#EFF4FF',
                              },
                            },
                          },
                        }}
                        value={formTwo?.employees}
                        onChange={(e) => {
                          onChange(e.target.value)
                          changeFormTwo({ employees: e.target.value })
                        }}
                        displayEmpty
                        // IconComponent={ArrowDown}
                        renderValue={(val) => {
                          if (val === '') {
                            return (
                              <Typography
                                sx={{
                                  fontFamily: 'Poppins',
                                  fontStyle: 'normal',
                                  fontWeight: '400',
                                  fontSize: '16px',
                                  lineHeight: '140%',
                                  color: '#94A3B8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: '31px',
                                }}
                              >
                                ex: 15
                              </Typography>
                            )
                          }
                          return val
                        }}
                      >
                        {EmployerNumOfEmployees.map((option) => (
                          <MenuItem key={option.label} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                {errors?.employees ? (
                  <ErrorMessage message={errors.employees.message} />
                ) : undefined}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          container
          alignItems={under678 ? 'center' : 'flex-start'}
          justifyContent={under678 ? 'center' : 'flex-start'}
          maxWidth="640px !important"
          gap={2}
        >
          <Grid item>
            <SecondaryButton text="Back" onClickHandler={handlePrevious} />
          </Grid>
          <Grid item mr={!under678 ? '14px' : undefined}>
            <PrimaryButton
              text="Next"
              type="submit"
              isValid={isValid}
              // styles={{ width: '100%' }}
            />
          </Grid>
        </Grid>
      </FormWrapper>
    </form>
  )
}
FormTwo.propTypes = {
  handleNext: PropTypes.func.isRequired,
  handlePrevious: PropTypes.func.isRequired,
}

FormTwo.defaultProps = {}

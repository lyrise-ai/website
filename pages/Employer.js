/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import '@fontsource/poppins'
import Image from "next/legacy/image"
import { useRouter } from 'next/router'
import { Typography, useMediaQuery } from '@mui/material'
import Header from '../src/components/Layout/Header/Header'
import FormOne from '../src/components/Employer/FormOne'
import FormTwo from '../src/components/Employer/FormTwo'
import FormThree from '../src/components/Employer/FormThree'
import FormProvider from '../src/components/Employer/FormContext/FormContext'
import FooterMobile from '../src/components/Employer/FooterMobile'

const columnContainer = {
  //   margin: '0 auto',
  height: 'calc(100vh - 105px)',
  flexWrap: 'nowrap',
  overflow: 'auto',
  overflowX: 'hidden',
  scrollbarWidth: 'thin',
  scrollbarColor: '#AEAEFF transparent',
  '&::-webkit-scrollbar': {
    borderRadius: 10,
    width: 7,
    backgroundColor: 'lightgrey',
    backgroundWidth: 2,
    scrollbarGutter: 'stable',
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 10,
    scrollPaddingLeft: 50,
    backgroundColor: '#AEAEFF',
    minHeight: 24,
    minWidth: 24,
  },
  '&::-webkit-scrollbar-thumb:focus': {
    backgroundColor: '#AEAEFF',
  },
  '&::-webkit-scrollbar-thumb:active': {
    backgroundColor: '#AEAEFF',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#AEAEFF',
  },
  '&::-webkit-scrollbar-corner': {
    backgroundColor: 'transparent',
  },
}

export default function Employer() {
  const router = useRouter()
  const under1100 = useMediaQuery('(max-width: 1100px)')
  const under678 = useMediaQuery('(max-width: 678px)')
  const under520 = useMediaQuery('(max-width: 520px)')
  const above768 = useMediaQuery('(min-width: 768px)')
  const [step, setStep] = useState(1)

  const handleNext = () => {
    setStep((prevStep) => {
      if (prevStep === 2) router.push('/Employer?page=3')
      if (prevStep <= 3) return prevStep + 1
    })
  }

  const handlePrevious = () => {
    setStep((prevStep) => {
      if (prevStep === 1) return
      return prevStep - 1
    })
  }

  const handleFormSteps = () => {
    // javascript switch case to show different form in each step
    switch (step) {
      // case 1 to show stepOne form and passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
      case 1:
        return (
          <FormOne
            step={step}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )
      // case 2 to show stepTwo form passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
      case 2:
        return (
          <FormTwo
            step={step}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        )
      // Only formData is passed as prop to show the final value at form submit
      case 3:
        return <FormThree step={step} />
      // default case to show nothing
      default:
        return <div className="App">default</div>
    }
  }

  return (
    <FormProvider>
      <Grid
        container
        style={{
          minHeight: '100vh',
          height: '100vh',
          position: 'fixed',
          gap: '0px',
          padding: '0',
          margin: '0',
        }}
        gap={0}
      >
        <Grid
          item
          xs={12}
          p={0}
          style={{ maxHeight: '105px', borderBottom: '1.5px solid #C5C5C5' }}
        >
          <Header />
        </Grid>
        {/* <Grid item xs={12} container></Grid> */}
        <Grid item container xs={12}>
          {/* left side */}
          <Grid
            container
            direction="column"
            item
            xs={under1100 ? 12 : 7}
            sx={{ backgroundColor: '#F9FAFC' }}
          >
            {/* the section under lyrise logo */}
            <Grid
              item
              container
              direction="column"
              alignItems="flex-start"
              justifyContent="stretch"
              p={
                under520
                  ? '48px 10px'
                  : under678
                  ? '48px 40px 70px 40px'
                  : '48px 70px 70px 70px'
              }
              sx={columnContainer}
              gap={1.5}
            >
              <Grid
                item
                container
                style={{ maxWidth: above768 ? '650px' : '100%' }}
              >
                {/* first child in column container */}

                {/* form 1/2/3 content */}
                <Grid item container xs={12}>
                  <Grid
                    xs={12}
                    item
                    mb="40px"
                    sx={{
                      width: under678 ? '100%' : undefined,
                    }}
                  >
                    {handleFormSteps()}
                  </Grid>
                </Grid>
                {under678 ? <FooterMobile step={step} /> : null}
              </Grid>
            </Grid>
          </Grid>
          {/* right side image */}
          {!under1100 && (
            <Grid
              item
              container
              justifyContent="center"
              alignItems="center"
              xs={5}
              sx={{
                backgroundColor: '#EFF4FF',
              }}
            >
              <Grid
                item
                container
                direction="column"
                xs={11}
                wrap="nowrap"
                sx={{ height: '100%' }}
              >
                <Grid item xs={8} sx={{ width: '100%' }}>
                  <div
                    style={{
                      maxWidth: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={
                        step === 2
                          ? '/images/progress_img.svg'
                          : '/images/rocket_img.svg'
                      }
                      alt={step === 2 ? 'progress image' : 'rocket image'}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    width: '100%',

                    padding: '10px 18px',
                  }}
                >
                  <Typography
                    style={{
                      textAlign: 'center',
                      fontSize: '32px',
                      color: '#00359E',
                      lingHeight: '120%',
                    }}
                  >
                    Hire from a network of select AI engineers and Data
                    Scientists.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </FormProvider>
  )
}

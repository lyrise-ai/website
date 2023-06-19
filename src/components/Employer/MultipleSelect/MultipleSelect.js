/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'
import PropTypes from 'prop-types'
// import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
// import Select from '@mui/material/Select'
import {
  Autocomplete,
  Grid,
  // Grid,
  // InputAdornment,
  TextField,
  Typography,
  // Typography,
  useMediaQuery,
} from '@mui/material'
// import { makeStyles } from '@mui/styles'
import CloseIcon from '@mui/icons-material/Close'
import { ReactComponent as ArrowDown } from '../../../assets/arrowDown.svg'
import { ReactComponent as SearchIcon } from '../../../assets/searchIcon.svg'
import { ReactComponent as TickCircle } from '../../../assets/tickCircle.svg'

// const helperTextStyles = makeStyles(() => ({
//   root: {
//     margin: 4,
//     color: 'red',
//     background: 'transparent !important',
//   },
//   error: {},
// }))

export default function MultipleSelect({ options }) {
  const under678 = useMediaQuery('(max-width: 678px)')

  //   function handleHelperText() {
  //     if (isHelperTextVisible && skills.length < 7) {
  //       return (
  //         <Grid item style={{ paddingTop: '5px' }}>
  //           <span
  //             style={{
  //               fontSize: '14px',
  //               color: '#a60a3d',
  //               textDecoration: 'underline',
  //             }}
  //           >
  //             {helperText}
  //           </span>
  //         </Grid>
  //       )
  //     }
  //     return undefined
  //   }
  return (
    <Grid item>
      <FormControl
        sx={{
          // height: '52px',
          width: under678 ? '100%' : '640px',
          backgroundColor: 'white',
        }}
      >
        <Autocomplete
          multiple
          options={options}
          popupIcon={<ArrowDown />}
          // set min height to 52px to match the height of the input
          sx={{
            '& .MuiAutocomplete-inputRoot': {
              minHeight: '52px !important',
            },
          }}
          ListboxProps={{
            sx: {
              maxHeight: '200px',
            },
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
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
                <TickCircle />
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
                  {option.label}
                </Typography>
                <div
                  style={{
                    alignSelf: 'flex-end',
                    cursor: 'pointer',
                    color: 'grey',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  // onClick={} () => {
                  // setSkills(skills.filter((skill) => skill !== option))
                  // }
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
          getOptionLabel={(option) => option.label}
          filterSelectedOptions
          // value={skills}
          // onChange={(e, newValue) => setSkills(newValue)}
          renderInput={(params) => (
            <TextField
              sx={{
                width: under678 ? '100%' : '640px',
                backgroundColor: 'white',
                minHeight: '52px',
              }}
              {...params}
              placeholder="ex:Python"
              // helperText={getHelperText()}
              // FormHelperTextProps={{ classes: helperTextClasses }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {params.InputProps.startAdornment}
                    <SearchIcon />
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
                  '& .MuiInputBase-input::-webkit-input-placeholder': {
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
        />
      </FormControl>
    </Grid>
  )
}

MultipleSelect.propTypes = {
  options: PropTypes.array.isRequired,
}

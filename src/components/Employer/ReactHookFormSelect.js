// import PropTypes from 'prop-types'

// import {
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from '@mui/material'
// import { Controller } from 'react-hook-form'

// const ReactHookFormSelect = ({
//   name,
//   label,
//   control,
//   defaultValue,
//   children,
//   register,
//   options,
//   errors,
//   ...props
// }) => {
//   return (
//     <FormControl
//       sx={{
//         width: '100%',
//         backgroundColor: 'white',
//       }}
//     >
//       <TextField
//         name={name}
//         select
//         fullWidth
//         defaultValue={defaultValue.value}
//         inputProps={register(name, {
//           required: 'Required',
//         })}
//         error={errors.name}
//         helperText={errors.name?.message}
//         renderValue={(value) => {
//           if (value === '') {
//             return (
//               <Typography
//                 sx={{
//                   fontFamily: 'Poppins',
//                   fontStyle: 'normal',
//                   fontWeight: '400',
//                   fontSize: '16px',
//                   lineHeight: '140%',
//                   color: '#94A3B8',
//                   display: under400 ? 'none' : undefined,
//                 }}
//               >
//                 Please select your area of expertise
//               </Typography>
//             )
//           }
//           return value
//         }}
//       >
//         {options.map((option) => (
//           <MenuItem key={option.value} value={option.value}>
//             {option.label}
//           </MenuItem>
//         ))}
//       </TextField>
//       {/* <InputLabel id={labelId}>{label}</InputLabel> */}
//       {/* <Controller
//         render={({
//           field: { onChange, value },
//           formState: { defaultValues },
//         }) => (
//           <Select
//             sx={{
//               height: '52px',
//             }}
//             displayEmpty
//             defaultValue=""
//             onChange={onChange}
//             value={value || defaultValue?.employees}
//             labelId={labelId}
//             label={label}
//             // IconComponent={ArrowDown}
//             renderValue={(val) => {
//               if (value === '') {
//                 return (
//                   <Typography
//                     sx={{
//                       fontFamily: 'Poppins',
//                       fontStyle: 'normal',
//                       fontWeight: '400',
//                       fontSize: '16px',
//                       lineHeight: '140%',
//                       color: '#94A3B8',
//                       // display: under400 ? 'none' : undefined,
//                     }}
//                   >
//                     ex: 15
//                   </Typography>
//                 )
//               }
//               return val
//             }}
//           >
//             {children}
//           </Select>
//         )}
//         name={name}
//         control={control}
//       /> */}
//     </FormControl>
//   )
// }

// ReactHookFormSelect.propTypes = {
//   name: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired,
//   control: PropTypes.func.isRequired,
//   defaultValue: PropTypes.string.isRequired,
//   children: PropTypes.node.isRequired,
//   register: PropTypes.func.isRequired,
//   options: PropTypes.array.isRequired,
//   errors: PropTypes.object.isRequired,
//   props: PropTypes.object,
// }
// export default ReactHookFormSelect

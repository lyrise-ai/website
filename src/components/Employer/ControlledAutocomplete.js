// import { Autocomplete } from '@mui/material'
// import { Controller } from 'react-hook-form'

// export default function ControlledAutocomplete({
//   options = [],
//   renderInput,
//   getOptionLabel,
//   onChange: ignored,
//   control,
//   defaultValue,
//   name,
//   renderOption,
// }) {
//   return (
//     <Controller
//       render={({ onChange, ...props }) => (
//         <Autocomplete
//           options={options}
//           getOptionLabel={getOptionLabel}
//           renderOption={renderOption}
//           renderInput={renderInput}
//           onChange={(e, data) => {
//             console.log({ data })
//           }}
//           {...props}
//         />
//       )}
//       onChange={([, data]) => {
//         console.log({ data })
//       }}
//       defaultValue={defaultValue}
//       name={name}
//       control={control}
//     />
//   )
// }

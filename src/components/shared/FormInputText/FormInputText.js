import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import { TextField } from '@mui/material'

const FormInputText = ({ name, label, control }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField onChange={onChange} value={value} label={label} />
      )}
    />
  )
}

FormInputText.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.any.isRequired,
}
export default FormInputText

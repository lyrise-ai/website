import { PhoneInput } from 'react-international-phone'
// import './phoneinput.css';
import 'react-international-phone/style.css'

const FormInput = ({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  required = true,
  pattern,
  maxLength,
}) => (
  <div>
    <label htmlFor={name} className="block text-sm mb-1 font-secondary">
      {label}
      {required && <span className="text-rose-500">*</span>}
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        maxLength={maxLength}
        className={`w-full px-2 py-2 border rounded-md focus:outline-none`}
      />
    </label>
  </div>
)

const FormSelect = ({ label, name, value, onChange, options, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm mb-1 font-secondary">
      {label}
      <span className="text-rose-500">*</span>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
        className={`w-full px-2 py-2 border rounded-md focus:outline-none appearance-none bg-white`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  </div>
)

function FormPhoneInput({
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  required = true,
  maxLength,
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-1 font-secondary">
        {label}
        {required && <span className="text-rose-500">*</span>}
        <PhoneInput
          value={value}
          onChange={(phone) => {
            onChange({ target: { name, value: phone } })
          }}
          placeholder={placeholder}
          required={required}
          id={name}
          name={name}
          pattern={'[0-9]{10,14}'}
          maxLength={maxLength}
          inputStyle={{
            width: '100%',
            fontSize: '0.875rem',
            borderTopRightRadius: '0.375rem',
            borderBottomRightRadius: '0.375rem',
            borderLeft: 'none',
          }}
          countrySelectorStyleProps={{
            buttonStyle: {
              borderTopLeftRadius: '0.375rem',
              borderBottomLeftRadius: '0.375rem',
              borderLeft: '1px solid #d1d5db',
              borderRight: '1px solid transparent',
            },
          }}
          defaultCountry="eg"
        />
      </label>
    </div>
  )
}

export { FormInput, FormSelect, FormPhoneInput }
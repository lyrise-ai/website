/* eslint-disable no-console */
import { useState, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

export const FormContext = createContext()

export default function FormProvider({ children }) {
  const [formOne, setFormOne] = useState({
    name: '',
    email: '',
    phone: '+1',
    skills: [],
    jobType: 0,
  })

  const changeFormOne = (formOneValues) => {
    // setFormOne({ ...formOne, skills: [] })
    setFormOne((prevValues) => ({
      ...prevValues,
      ...formOneValues,
    }))
  }

  const [formTwo, setFormTwo] = useState({
    companyName: '',
    companyWebsite: '',
    isFunded: 0,
    employees: '',
  })

  const changeFormTwo = (formTwoValues) => {
    setFormTwo((prevValues) => ({
      ...prevValues,
      ...formTwoValues,
    }))
  }

  // useEffect(() => {
  //   console.log({ formOne })
  //   console.log({ formTwo })
  // }, [formOne, formTwo])

  return (
    <FormContext.Provider
      value={{ formOne, changeFormOne, formTwo, changeFormTwo }}
    >
      {children}
    </FormContext.Provider>
  )
}

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useFormData = () => useContext(FormContext)

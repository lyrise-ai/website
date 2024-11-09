import { useCallback, useState } from 'react'

export default function useLocalStorage(key) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(error)
      return null
    }
  })

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue)
        window.localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(error)
      }
    },
    [key],
  )

  return [value, setStoredValue]
}

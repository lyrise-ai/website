import { useSession } from 'next-auth/react'
import useLocalStorage from './useLocalStorage'
import { setAPIXUserEmailHeader } from '../services/accelerator.services'

export default function useWeakAuth() {
  const { data: session } = useSession()
  const [localStorageEmail, setLocalStorageEmail] = useLocalStorage('email')
  let email

  if (localStorageEmail) {
    email = localStorageEmail
  }

  if (session && session.user) {
    email = session.user.email
  }

  if (email) setAPIXUserEmailHeader(email)

  return {
    email,
    setPersistedEmail: setLocalStorageEmail,
  }
}

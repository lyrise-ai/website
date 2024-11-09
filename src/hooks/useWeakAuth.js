import { useSession } from 'next-auth/react'
import useLocalStorage from './useLocalStorage'

export default function useWeakAuth() {
  const { data: session } = useSession()
  const [localStorageEmail, setLocalStorageEmail] = useLocalStorage('email')

  if (localStorageEmail) {
    return localStorageEmail
  }

  if (session && session.user) {
    return session.user.email
  }

  return null
}

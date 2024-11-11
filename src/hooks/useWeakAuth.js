import { useSession } from 'next-auth/react'
import { setAPIXUserEmailHeader } from '../services/accelerator.services'
import { useState, useEffect } from 'react'

export default function useWeakAuth() {
  const { data: session } = useSession()
  const [email, setEmail] = useState(null)
  const localStorageEmail =
    typeof window !== 'undefined' ? window.localStorage.getItem('email') : null

  useEffect(() => {
    if (localStorageEmail) {
      setEmail(localStorageEmail)
    }
    if (session && session.user) {
      setEmail(session.user.email)
    }
  }, [session, localStorageEmail])

  if (email) setAPIXUserEmailHeader(email)

  const setPersistedEmail = (newEmail) => {
    setEmail(newEmail)
    window.localStorage.setItem('email', newEmail)
  }

  return {
    email,
    setPersistedEmail,
  }
}

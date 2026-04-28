import { useEffect, useState } from 'react'
import { supabase } from '../../src/lib/supabase'

export default function SignOut() {
  const [user, setUser] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    checkUser()
  }, [])
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMessage('Logout failed: ' + error.message)
      return
    }
    setUser(null)
    setMessage('Logout successfully')
  }
  return (
    <div style={{ padding: '40px' }}>
      <h1>Account</h1>
      {user ? (
        <div>
          <p>Hello {user.email}</p>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
      {message && <p>{message}</p>}
    </div>
  )
}

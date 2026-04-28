import { useState } from 'react'
import { supabase } from '../../src/lib/supabase'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('Loging in ...')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage('Error: ' + data.error)
      return
    }
    await supabase.auth.setSession(data.session)
    if (data.role === 'EMPLOYEE') {
      router.push('/dashboard')
    } else if (data.role === 'CLIENT') {
      router.push('/roi-report')
    }
  }
  return (
    <div style={{ padding: '40px' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

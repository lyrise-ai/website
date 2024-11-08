import { useRouter } from 'next/router'

import Countdown from '@components/Accelerator/countdown'
import Leaderboard from '@components/Accelerator/leaderboard'
import ArrowButton from '@components/Buttons/ArrowButton'

export default function Accelerator() {
  const router = useRouter()
  function handleRegister() {
    router.push('/join-accelerator')
  }
  return (
    <main className="min-h-screen flex items-center justify-center flex-col p-3">
      <Countdown timestamp={new Date('2024-11-14').getTime()} />
      <Leaderboard />
      <ArrowButton onClick={handleRegister}>Register your Startup!</ArrowButton>
    </main>
  )
}

import { useRouter } from 'next/router'

import Countdown from '@components/Accelerator/countdown'
import Leaderboard from '@components/Accelerator/leaderboard'
import ArrowButton from '@components/Buttons/ArrowButton'

import Layout from '../src/components/Layout/Layout'

export default function Accelerator() {
  const router = useRouter()
  function handleRegister() {
    router.push('/join-accelerator')
  }
  return (
    <Layout isRaw>
      <main className="min-h-screen flex items-center justify-center flex-col p-3 gap-3 bg-white">
        <Countdown timestamp={new Date('2024-11-14').getTime()} />
        <Leaderboard />
        <ArrowButton onClick={handleRegister}>
          Register your Startup!
        </ArrowButton>
      </main>
    </Layout>
  )
}

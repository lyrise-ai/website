import { useRouter } from 'next/router'

import Countdown from '@components/Accelerator/countdown'
import Leaderboard from '@components/Accelerator/leaderboard'
import RegisterBottomSheet from '@components/Accelerator/register-bottom-sheet'

import Layout from '../src/components/Layout/Layout'

export default function Accelerator() {
  return (
    <Layout isRaw>
      <main className="flex items-center justify-center flex-col p-3 gap-3 bg-white">
        <Countdown timestamp={new Date('2024-11-14').getTime()} />
        <Leaderboard />
        <RegisterBottomSheet />
      </main>
    </Layout>
  )
}

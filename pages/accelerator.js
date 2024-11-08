import Countdown from '@components/Accelerator/countdown'
import Leaderboard from '@components/Accelerator/leaderboard'
import ArrowButton from '@components/Buttons/ArrowButton'

export default function Accelerator() {
  function handleRegister() {
    alert('Register your startup!')
  }
  return (
    <main className="min-h-screen flex items-center justify-center flex-col">
      <Countdown timestamp={new Date('2024-11-14').getTime()} />
      <Leaderboard />
      <ArrowButton onClick={handleRegister}>Register your Startup!</ArrowButton>
    </main>
  )
}

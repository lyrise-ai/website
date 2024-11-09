import { useRouter } from 'next/router'

import Countdown from '@components/Accelerator/countdown'
import Leaderboard from '@components/Accelerator/leaderboard'
import RegisterBottomSheet from '@components/Accelerator/register-bottom-sheet'
import VoteRegisterDialog from '@components/Accelerator/vote-register-dialog'

import Layout from '../src/components/Layout/Layout'
import { useState } from 'react'

export default function Accelerator() {
  const [isVoteRegisterDialogOpen, setIsVoteRegisterDialogOpen] =
    useState(false)

  const openVoteRegisterDialog = () => {
    setIsVoteRegisterDialogOpen(true)
  }

  const closeVoteRegisterDialog = () => {
    setIsVoteRegisterDialogOpen(false)
  }

  return (
    <Layout isRaw>
      <main className="relative flex items-center justify-center flex-col p-3 gap-3 bg-white">
        <Countdown timestamp={new Date('2024-11-14').getTime()} />
        <Leaderboard openVoteRegisterDialog={openVoteRegisterDialog} />
        <RegisterBottomSheet />
        <VoteRegisterDialog
          isOpen={isVoteRegisterDialogOpen}
          onClose={closeVoteRegisterDialog}
        />
      </main>
    </Layout>
  )
}

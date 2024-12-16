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
      <div className="bg-white w-full">
        <main className="relative flex items-center justify-center flex-col p-3 gap-3 bg-white max-w-7xl mx-auto mb-[30vh]">
          <Countdown timestamp={new Date('2025-1-1').getTime()} />
          <Leaderboard openVoteRegisterDialog={openVoteRegisterDialog} />
          <RegisterBottomSheet withHowItWorksLink />
          <VoteRegisterDialog
            isOpen={isVoteRegisterDialogOpen}
            onClose={closeVoteRegisterDialog}
          />
        </main>
      </div>
    </Layout>
  )
}

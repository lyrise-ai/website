import React from 'react'
import {
  useRive,
  Layout,
  Fit,
  Alignment,
  useStateMachineInput,
} from '@rive-app/react-canvas'

// import RiveFile from "./vault.riv"

const getVaultTranslation = {
  // key is the activeItem
  0: 'translate(-30px, 30px) scale(0.50)',
  1: 'translate(30px, 30px) scale(0.50)',
  2: 'translate(30px, -20px) scale(0.50)',
  3: 'translate(-30px, -20px) scale(0.50)',
  4: 'translate(0, -30px) scale(0.50)',
  null: 'translate(0, 0) scale(0.65)',
}

const toVaultState = {
  0: 3,
  1: 4,
  2: 0,
  3: 2,
  4: 1,
}

function RiveVault({ activeItem }) {
  const { rive, RiveComponent } = useRive({
    src: '/vault.riv',
    stateMachines: 'Vault',
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
    // autoplay: true,
  })

  const RiveActiveState = useStateMachineInput(rive, 'Vault', 'ActiveState', 9)

  React.useEffect(() => {
    if (RiveActiveState && rive) {
      if (activeItem === null) {
        rive.pause()
        RiveActiveState.value = 9
        // rive.stop()
        // rive.stopRendering()
        // rive.startRendering()
      } else {
        rive.play()
        setTimeout(() => {
          RiveActiveState.value = toVaultState[activeItem]
        }, 10)
      }
    }
  }, [activeItem])

  return (
    <div
      className="w-full h-full transition-transform ease-in-out duration-1000 "
      style={{
        transform: getVaultTranslation[activeItem],
      }}
    >
      <RiveComponent />
    </div>
  )
}

export default RiveVault

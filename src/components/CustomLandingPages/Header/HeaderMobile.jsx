import { Menu as MenuIcon } from '@mui/icons-material'
import { Drawer, IconButton } from '@mui/material'
import { useState } from 'react'
import logo from '../../../assets/full-Logo-white.svg'
import Image from 'next/legacy/image'
import CloseIcon from '@mui/icons-material/Close'

const HeaderMobile = ({ navigation, buttons }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setIsOpen(open)
  }

  return (
    <div className="block md:hidden">
      <IconButton
        onClick={toggleDrawer(true)}
        className="relative z-100 flex items-center justify-center w-10 h-10 rounded-lg bg-main/15"
        aria-label="Open menu"
      >
        <MenuIcon className="size-8 text-main" />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#20273b',
            width: '75%',
            maxWidth: '24rem',
          },
        }}
      >
        <div className="flex flex-col h-full p-6">
          <div className="space-y-2">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  <Image src={logo} alt="Lyrise AI" className="w-28" />
                </div>
                <CloseIcon
                  className="size-8 text-white"
                  onClick={toggleDrawer(false)}
                />
              </div>
              <div className="text-[16px] leading-[120%] text-[#737373]">
                LyRise AI: The Platform to Adopt AI Easier and Faster
              </div>
            </div>
          </div>
          <ul className="mt-4 flex flex-col gap-0 font-space-grotesk font-normal text-[#ffffff]">
            {navigation.map(({ id, label, path }) => (
              <li key={id}>
                <a
                  href={'#' + path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] inline-block relative after:absolute after:start-1/2 after:-translate-x-1/2 after:bottom-[1px] after:h-[1px] after:w-full after:transition-transform after:scale-0 hover:after:scale-100 after:rounded-full after:bg-[#ffffff]"
                  onClick={toggleDrawer(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex-1 flex flex-row items-end justify-start">
            {buttons.map(({ id, label, path }) => (
              <a
                key={id}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl inline-block px-4 py-2 rounded-lg text-white bg-main transition-colors hover:bg-main/90"
                onClick={toggleDrawer(false)}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default HeaderMobile

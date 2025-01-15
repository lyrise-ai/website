import { Avatar, Badge, styled } from '@mui/material'
import React from 'react'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))

function AuthorBox() {
  return (
    <div className="flex items-center gap-2">
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar alt="Phoenix Baker" src="/static/images/avatar/1.jpg" />
      </StyledBadge>
      <div className="flex flex-col">
        <p className="text-[#101828] text-[16px] font-[600] leading-[20px]">
          Phoenix Baker
        </p>
        <p className="text-[#475467] text-[14px] font-[400] leading-[20.6px]">
          Product Manager
        </p>
      </div>
    </div>
  )
}

export default AuthorBox

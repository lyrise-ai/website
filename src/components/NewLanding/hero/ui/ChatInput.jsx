import React from 'react'
import SendIcon from '../../../../assets/icons/sendIcon'
import ChatFileInput from './ChatFileInput'
import { useChatFocus } from '../../../../providers/ChatFocusContext'
import { useMediaQuery } from '@mui/material'

export default function ChatInput({
  userInput,
  setUserInput,
  isLoading,
  handleSubmit,
  disabled,
}) {
  const { setIsChatFocused } = useChatFocus()
  const isMobile = useMediaQuery('(max-width: 1000px)')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFocus = () => {
    if (isMobile) {
      setIsChatFocused(true)
    }
  }

  const handleBlur = () => {
    setIsChatFocused(false)
  }

  return (
    <div
      className="flex flex-row w-full items-center bg-white rounded-lg overflow-hidden"
      style={{ boxShadow: '0px 4px 8px 0px rgba(0, 34, 158, 0.08)' }}
    >
      <ChatFileInput setUserInput={setUserInput} />
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Type your message..."
        className="h-[1.2lh] flex-1 focus:outline-none text-base resize-none"
      />
      <button
        disabled={isLoading || disabled}
        type="submit"
        className="text-white px-4 py-2 rounded-r-lg transition duration-300 disabled:opacity-50 h-full"
      >
        <SendIcon className="h-auto w-5" />
      </button>
    </div>
  )
}

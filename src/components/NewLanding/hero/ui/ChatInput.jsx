import React, { useEffect, useRef } from 'react'
import SendIcon from '../../../../assets/icons/sendIcon'
import ChatFileInput from './ChatFileInput'
import { useChatFocus } from '../../../../providers/ChatFocusContext'
import { useMediaQuery } from '@mui/material'

import styles from './ChatInput.module.css'
import useChatInputHeightCSSVar from '../../../../hooks/useChatInputHeightCSSVar'

export default function ChatInput({
  userInput,
  setUserInput,
  isLoading,
  handleSubmit,
  disabled,
}) {
  const textareaRef = useRef(null)
  const { setIsChatFocused } = useChatFocus()
  const isMobile = useMediaQuery('(max-width: 1000px)')
  const CSSChatInputHeight = useChatInputHeightCSSVar()

  useEffect(() => {
    if (userInput.length === 0) {
      CSSChatInputHeight.reset()
    } else {
      if (textareaRef.current) {
        const newheight = textareaRef.current.scrollHeight + 'px'
        CSSChatInputHeight.set(newheight)
      }
    }
  }, [userInput])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault()
      handleSubmit(e)
      CSSChatInputHeight.reset()
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
      className="flex flex-row w-full items-center bg-white rounded-lg overflow-hidden min-h-fit py-1"
      style={{ boxShadow: '0px 4px 8px 0px rgba(0, 34, 158, 0.08)' }}
    >
      <ChatFileInput setUserInput={setUserInput} />
      <textarea
        value={userInput}
        ref={textareaRef}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Type your message..."
        className={styles.chat_textarea}
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

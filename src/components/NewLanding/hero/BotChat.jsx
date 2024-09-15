import React, { useEffect, useRef, useState } from 'react'
import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom'

import useBotChat from '../../../hooks/useBotChat'
import ChatInput from './ui/ChatInput'
import ChatMessaage from './ui/ChatMessaage'
import Thinking from './ui/Thinking'

const BotChat = () => {
  const { conversation, sessionId, isLoading, addMessage, sendMessage } =
    useBotChat()

  const [userInput, setUserInput] = useState('')

  const scrollToBottomButtonRef = useRef(null)

  const scrollToBottom = () => {
    // click the hidden button to scroll to bottom
    if (scrollToBottomButtonRef.current) scrollToBottomButtonRef.current.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (userInput.trim()) {
      try {
        const msg = userInput.trim()
        setUserInput('')
        await sendMessage(msg)
      } catch (error) {
        console.error('Error getting bot response:', error)
        addMessage('Sorry, there was an error processing your request.', 'bot')
      }
    }
  }

  // scroll to bottom whenever the conversation changes
  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  return (
    <div className="bg-primary-25 shadow-lg rounded-2xl py-3 w-full h-full flex flex-col justify-between border-2 lg:border-[4px] border-primary">
      <ScrollToBottom
        className="overflow-y-auto mb-4 flex flex-col h-full"
        followButtonClassName="hidden"
      >
        <div className="flex flex-col h-[70vh]">
          {conversation.map((message, index) => (
            <ChatMessaage
              key={message.timestamp}
              message={message}
              index={index}
              sessionId={sessionId}
            />
          ))}
          {isLoading ? <Thinking /> : null}
        </div>
        <ScrollToBottomHiddenRef buttonRef={scrollToBottomButtonRef} />
      </ScrollToBottom>
      <form onSubmit={handleSubmit} className="flex mb-2 float-end px-4">
        <ChatInput
          userInput={userInput}
          setUserInput={setUserInput}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          disabled={!sessionId} // disable chatting if the sessionId is not available yet
        />
      </form>
    </div>
  )
}

const ScrollToBottomHiddenRef = ({ buttonRef }) => {
  const scrollToBottom = useScrollToBottom()

  return (
    <button
      type="button"
      onClick={scrollToBottom}
      ref={buttonRef}
      className="hidden"
    ></button>
  )
}

export default BotChat

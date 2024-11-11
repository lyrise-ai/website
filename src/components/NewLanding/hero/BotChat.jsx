import React, { useRef, useState } from 'react'

// components
import ChatInput from './ui/ChatInput'
import ChatMessaage from './ui/ChatMessaage'
import Thinking from './ui/Thinking'

// hooks
import Image from 'next/legacy/image'
import useBotChat from '../../../hooks/useBotChat'
import useScrollOnNewContent from '../../../hooks/useScrollOnNewContent'

import desktopInstructionsImage from '../../../assets/hero/desktop-instructions.png'
import mobileInstructionsImage from '../../../assets/hero/mobile-instructions.png'
import { useChatFocus } from '../../../providers/ChatFocusContext'

const BotChat = () => {
  const { conversation, sessionId, isLoading, addMessage, sendMessage } =
    useBotChat()

  const scrollRef = useRef(null)

  // scroll down whenever a new message is added
  useScrollOnNewContent(scrollRef, conversation)

  const [userInput, setUserInput] = useState('')

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

  return (
    <div className="relative bg-primary-25 shadow-lg rounded-2xl py-3 w-full h-full flex flex-col justify-between border-2 lg:border-[4px] border-primary">
      <div
        className="flex flex-col h-full overflow-y-auto scroll-smooth"
        ref={scrollRef}
      >
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
      <form onSubmit={handleSubmit} className="flex mb-2 float-end px-4">
        <ChatInput
          userInput={userInput}
          setUserInput={setUserInput}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          disabled={!sessionId} // disable chatting if the sessionId is not available yet
        />
      </form>
      {/* <DesktopInstructions />
      <MobileInstructions /> */}
    </div>
  )
}

export default BotChat

function DesktopInstructions() {
  return (
    <div className="hidden md:block absolute -bottom-3 -translate-x-[92%]">
      <Image
        src={desktopInstructionsImage}
        alt="Try it now"
        width={220}
        height={220}
        objectFit="contain"
      />
    </div>
  )
}

function MobileInstructions() {
  const { isChatFocused } = useChatFocus()

  if (isChatFocused) {
    return null
  }

  return (
    <div className="block md:hidden absolute -translate-y-[80%] -right-5">
      <Image
        src={mobileInstructionsImage}
        alt="Try it now"
        width={200}
        height={200}
      />
    </div>
  )
}

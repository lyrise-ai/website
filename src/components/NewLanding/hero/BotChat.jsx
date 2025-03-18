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
import MessageAvatar from './ui/MessageAvatar'

const BotChat = () => {
  const { conversation, sessionId, isLoading, addMessage, sendMessage } =
    useBotChat()

  const scrollRef = useRef(null)

  // scroll down whenever a new message is added

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
    <div className="relative shadow-[0px_0px_4px_0px_#2957FF] rounded-2xl py-8 px-10 w-full h-full flex flex-col justify-between ">
      <LyriseAiName />
      <div
        className="chatBot-container flex flex-col h-full overflow-y-auto scroll-smooth "
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
      <ChatFooter />
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

// backdrop-filter: blur(36px)

const LyriseAiName = () => {
  return (
    <div className="absolute top-5 left-[50%] translate-x-[-50%] bg-[#202842] rounded-lg  shadow-[0px_0px_8px_0px_#5571baa1] backdrop-blur-[36px] px-3 py-2 flex items-center gap-2">
      <MessageAvatar type="bot" />
      <h1 className="text-[20px] text-white font-secondary ">LyRiseAI</h1>
    </div>
  )
}

const ChatFooter = () => {
  return (
    <div className="flex justify-between items-center mt-4 px-6">
      <p className="text-sm text-gray-400">
        © 2025 LyRise AI. All Rights Reserved.
      </p>
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-400">Terms of Use</p>
        <p className="text-sm text-gray-400">Privacy Policy</p>
      </div>
    </div>
  )
}

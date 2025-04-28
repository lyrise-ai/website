import { useRef, useState } from 'react'

// hooks
// components
import ChatInput from './UI/ChatInput'
import ChatMessaage from './UI/ChatMessage'
import MessageAvatar from './UI/MessageAvatar'
import useBotChat from './hooks/useBotChat'
import useScrollOnNewContent from './hooks/useScrollOnNewContent'
import Thinking from '../../../NewLanding/hero/ui/Thinking'

// import { useChatFocus } from './context/chat-focus'

// import desktopInstructionsImage from '../../../assets/hero/desktop-instructions.png'
// import mobileInstructionsImage from '../../../assets/hero/mobile-instructions.png'

const BotChat = () => {
  const { conversation, sessionId, isLoading, sendMessage, addMessage } =
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
    <div className="relative shadow-[0px_0px_4px_0px_#2957FF] rounded-2xl py-4 md:py-6 xl:py-8 px-2 md:px-5 xl:px-10 w-full h-full flex flex-col justify-between ">
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

const LyriseAiName = () => {
  return (
    <div className="absolute top-5 left-[50%] translate-x-[-50%] bg-[#202842] rounded-lg  shadow-[0px_0px_8px_0px_#5571baa1] backdrop-blur-[36px] px-3 py-2 flex items-center gap-2">
      <MessageAvatar type="bot" />
      <h1 className="text-[20px] text-white font-poppins ">LyRiseAI</h1>
    </div>
  )
}

const ChatFooter = () => {
  return (
    <div className="flex justify-between items-center mt-4 px-3 md:px-6">
      <p className="text-[10px] md:text-sm text-gray-400">
        © 2025 LyRise AI. All Rights Reserved.
      </p>
      <div className="flex items-center gap-4">
        <p className="text-[10px] md:text-sm text-gray-400">Terms of Use</p>
        <p className="text-[10px] md:text-sm text-gray-400">Privacy Policy</p>
      </div>
    </div>
  )
}

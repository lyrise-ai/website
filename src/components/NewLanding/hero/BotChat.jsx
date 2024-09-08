import React, { useEffect, useRef, useState } from 'react'
import useBotChat from '../../../hooks/useBotChat'
import ChatInput from './ui/ChatInput'
import ChatMessaage from './ui/ChatMessaage'

const BotChat = () => {
  const {
    conversation,
    addMessage,
    clearConversation,
    sendMessage,
    onChatSuccess,
    isLoading,
    sessionId,
  } = useBotChat()

  const [userInput, setUserInput] = useState('')
  const scrollRef = useRef(null)

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

  useEffect(() => {
    scrollRef.current.scrollTo({
      bottom: 0,
      behavior: 'smooth',
    })
  }, [conversation.length])

  return (
    <div className="bg-primary-25 shadow-lg rounded-2xl p-4 w-full h-full flex flex-col justify-between border-2 lg:border-[4px] border-primary">
      <div className="overflow-y-auto mb-4 flex flex-col h-full">
        <div className="flex flex-col h-[60vh]" ref={scrollRef}>
          {conversation.map((message, index) => (
            <ChatMessaage
              key={message.timestamp}
              message={message}
              index={index}
              sessionId={sessionId}
            />
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex mb-2 float-end">
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

export default BotChat

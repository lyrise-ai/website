import React, { useState } from 'react'
import useBotChat from '../../../hooks/useBotChat'
import ChatInput from './ui/ChatInput'

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
    <div className="bg-primary-25 shadow-lg rounded-2xl p-4 w-full h-full flex flex-col justify-between border-[4px] border-primary">
      <div className="overflow-y-auto mb-4 flex flex-col h-full">
        <div className="flex flex-col h-[60vh]">
          {conversation.map((message, index) => (
            <div
              key={message.id}
              className={`
                message ${message.type}
                text-base font-secondary
                mb-2 p-2 rounded-lg
                ${
                  message.type === 'user'
                    ? 'bg-blue-100 text-blue-800 ml-auto'
                    : 'bg-gray-100 text-gray-800'
                }
                ${index === 0 ? 'mt-auto' : ''}
              `}
            >
              {message.content}
            </div>
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

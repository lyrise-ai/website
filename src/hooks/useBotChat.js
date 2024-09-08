import { useEffect, useState } from 'react'
import {
  sendChatAnonMessage,
  startAnonymousChat,
} from '../services/chat.services'
import useConversation from './useConversation'

const INITIAL_BOT_MESSAGE = `Upload your job description file or copy paste it below. 
No job description? No problem! Just tell me what AI talent you’re looking for?`

const useBotChat = () => {
  const [sessionId, setSessionId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { conversation, addMessage, clearConversation } = useConversation()

  useEffect(() => {
    initializeConversation()
  }, [])

  const initializeConversation = async () => {
    sendInitialMessage()
    startNewChat()
  }

  const sendInitialMessage = async () => {
    const msg = INITIAL_BOT_MESSAGE
    await sendMessage(msg)
  }

  const startNewChat = async () => {
    try {
      const { chat_id } = await startAnonymousChat()
      setSessionId(chat_id)
    } catch (error) {
      console.log('Error starting new chat:', error)
    }
  }

  const sendMessage = async (userInput) => {
    if (userInput.trim()) {
      addMessage(userInput, 'user')
      setIsLoading(true)

      const data = {
        chat_id: sessionId,
        message: userInput,
      }

      try {
        const botResponse = await sendChatAnonMessage(data)
        addMessage(botResponse.message, 'bot')
      } catch (error) {
        console.error('Error getting bot response:', error)
        addMessage('Sorry, there was an error processing your request.', 'bot')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const storeConversation = async () => {
    // This function would be implemented to store the conversation in a database
    // It could be called when a booking attempt is made
    console.log('Storing conversation in database...')
    // Implement the database storage logic here
  }

  const redirectToSignup = () => {}

  const onChatSuccess = () => {
    // this function is called when the chat is successful
    // it should store the conversation in the database
    // and redirect to the web app signup page
    storeConversation()
  }

  return {
    conversation,
    sendMessage,
    clearConversation,
    onChatSuccess,
    sessionId,
    isLoading,
  }
}

export default useBotChat

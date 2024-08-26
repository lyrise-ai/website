import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'
import { getBotResponse } from '../services/chat.services'
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

  const initializeConversation = () => {
    // Generate a new session ID when the component mounts
    setSessionId('guest_conversation_' + nanoid())
    // add the initial bot message to the conversation
    addMessage(INITIAL_BOT_MESSAGE, 'bot')
  }

  const sendMessage = async (userInput) => {
    if (userInput.trim()) {
      addMessage(userInput, 'user')
      setIsLoading(true)
      try {
        const botResponse = await getBotResponse(sessionId, userInput)
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

  const redirectToSignup = () => { }

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

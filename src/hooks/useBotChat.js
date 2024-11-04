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
    if (conversation.length === 0) {
      addMessage(INITIAL_BOT_MESSAGE, 'bot')
    }
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

      const generalErrorMessage = "Sorry, there was an error processing your request."

      try {
        const botResponse = await sendChatAnonMessage(data)
        addMessage(botResponse.content, 'bot')
      } catch (error) {
        if (error.response) {
          const errorType = error.response.data.error;

          switch (errorType) {
            case "max-message-length-exceeded":
              addMessage("Message too long. Sign up to lift limits.", 'bot');
              break;
            case "max-chat-length-exceeded":
              addMessage("Chat limit reached. Sign up to continue the conversation.", 'bot');
              break;
            default:
              if (error.response.status === 429) {
                addMessage("Too many messages. Sign up to avoid delays.", 'bot');
              } else {
                console.error("Error getting bot response:", error);
                addMessage(generalErrorMessage, 'bot');
              }
          }
        } else {
          console.error("Error getting bot response:", error);
          addMessage(generalErrorMessage, 'bot');
        }
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

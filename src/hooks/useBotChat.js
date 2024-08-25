import { useState, useEffect } from 'react';
import { nanoid } from "nanoid"
import { getBotResponse } from '../services/chat.services';
import useConversation from './useConversation';


const useBotChat = () => {
    const [sessionId, setSessionId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { conversation, addMessage, clearConversation } = useConversation();

    useEffect(() => {
        // Generate a new session ID when the component mounts
        setSessionId("guest_conversation_" + nanoid());
    }, []);

    const sendMessage = async (userInput) => {
        if (userInput.trim()) {
            addMessage(userInput, 'user');
            setIsLoading(true);
            try {
                const botResponse = await getBotResponse(sessionId, userInput);
                addMessage(botResponse.message, 'bot');
            } catch (error) {
                console.error('Error getting bot response:', error);
                addMessage('Sorry, there was an error processing your request.', 'bot');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const storeConversation = async () => {
        // This function would be implemented to store the conversation in a database
        // It could be called when a booking attempt is made
        console.log('Storing conversation in database...');
        // Implement the database storage logic here
    };

    const redirectToSignup = () => {

    };

    const onChatSuccess = () => {
        // this function is called when the chat is successful
        // it should store the conversation in the database
        // and redirect to the web app signup page
        storeConversation();
    };

    return {
        conversation,
        sendMessage,
        clearConversation,
        onChatSuccess,
        sessionId,
        isLoading,
    };
};

export default useBotChat;

import { useState } from 'react';

const useConversation = () => {
  const [conversation, setConversation] = useState([]);

  const addMessage = (content, type) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date().toISOString(),
    };
    setConversation(prevConversation => [...prevConversation, newMessage]);
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return {
    conversation,
    addMessage,
    clearConversation,
  };
};

export default useConversation;
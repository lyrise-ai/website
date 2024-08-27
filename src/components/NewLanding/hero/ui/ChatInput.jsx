import React from 'react'
import SendIcon from '../../../../assets/icons/sendIcon'
import ChatFileInput from './ChatFileInput'

export default function ChatInput({ userInput, setUserInput, isLoading, handleSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div
      className="flex flex-row w-full items-center bg-white rounded-lg overflow-hidden"
      style={{ boxShadow: '0px 4px 8px 0px rgba(0, 34, 158, 0.08)' }}
    >
      <ChatFileInput setUserInput={setUserInput} />
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="h-[1.2lh] flex-1 focus:outline-none text-base resize-none"
      />
      <button
        disabled={isLoading}
        type="submit"
        className="text-white px-4 py-2 rounded-r-lg transition duration-300 disabled:opacity-50 h-full"
      >
        <SendIcon className="h-auto w-5" />
      </button>
    </div>
  )
}

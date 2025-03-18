import React from 'react'
import TalentCard from './TalentCard'
import MessageAvatar from './MessageAvatar'

export default function ChatMessaage({ message, index, sessionId }) {
  // ${message.type === 'user' ? '' : 'bg-transparent'}
  return (
    <div
      key={message.id}
      // max-w-[80%] w-fit
      className={`
        message ${message.type}
        text-base font-secondary text-wrap
        w-full p-4
        flex gap-2 max-md:flex-col  items-center
        text-white
        rounded-lg
          ${message.type === 'user' ? 'bg-[#192957] ' : ''}
        ${index === 0 ? 'mt-auto' : ''}
      `}
    >
      <MessageAvatar type={message.type} />

      {typeof message.content === 'string' ? (
        message.content
      ) : (
        <div>
          <p>{message.content.text}</p>
          <div className="flex flex-col gap-2 mt-2">
            {message.content.talents.map((talent, index) => (
              <TalentCard {...talent} index={index} sessionId={sessionId} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

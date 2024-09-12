import React from 'react'
import TalentCard from './TalentCard'

export default function ChatMessaage({ message, index, sessionId }) {
  return (
    <div
      key={message.id}
      // max-w-[80%] w-fit
      className={`
        message ${message.type}
        text-base font-secondary text-wrap
        w-full p-4
        ${
          message.type === 'user'
            ? 'bg-[#eff2ff] text-blue-800'
            : 'bg-transparent text-gray-800'
        }
        ${index === 0 ? 'mt-auto' : ''}
    `}
    >
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

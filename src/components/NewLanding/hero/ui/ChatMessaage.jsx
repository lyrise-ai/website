import React from 'react'
import TalentCard from './TalentCard'

export default function ChatMessaage({ message, index, sessionId }) {
  return (
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

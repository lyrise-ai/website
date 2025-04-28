import MessageAvatar from './MessageAvatar'
import TalentCard from './TalentCard'

export default function ChatMessaage({ message, index, sessionId }) {
  return (
    <div
      key={message.id}
      // max-w-[80%] w-fit
      className={`
        message ${message.type}
        text-base font-poppins text-wrap
        w-full p-4
        flex gap-2   items-center
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
              <TalentCard
                key={talent.id}
                {...talent}
                index={index}
                sessionId={sessionId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

import { ChatFocusContext } from '../../context/chat-focus'
import BotChat from './BotChat'

export default function ChatAi() {
  const [isChatFocused, setIsChatFocused] = useState(false)

  return (
    // note: overflow was hidden here
    <div className="w-full m-auto md:mb-20 max-w-[90vw] md:max-w-[85vw] lg:md:max-w-[65vw] gap-10 py-3 md:py-20 max-md:px-5">
      <div className="w-full md:max-lg:mr-10 h-[90vh] md:h-[80vh] lg:h-[88vh]">
        <div className="h-[100%]">
          <ChatFocusContext.Provider
            value={{ isChatFocused, setIsChatFocused }}
          >
            <BotChat />
          </ChatFocusContext.Provider>
        </div>
      </div>
    </div>
  )
}

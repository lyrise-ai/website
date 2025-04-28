import { createContext, useContext } from 'react'

export const ChatFocusContext = createContext({
  isChatFocused: false,
  setIsChatFocused: (isFocused) => {},
})

export const useChatFocus = () => {
  return useContext(ChatFocusContext)
}

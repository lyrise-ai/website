import { createContext } from 'react'

export const ChatFocusContext = createContext(false)

export const useChatFocus = () => {
  return useContext(ChatFocusContext)
}

import api from './api.services'

export async function startAnonymousChat() {
  // should return the chat id fetched from the server

  return api.post('/ai/anon-chat')
}

export async function sendChatAnonMessage(data) {
  // data: { chat_id, message }
  return api.post('/ai/send-anon-chat-message', data)
}

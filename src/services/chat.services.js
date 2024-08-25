import { api } from './api.services'

export async function getBotResponse(sessionId, message) {
    // TODO: add this to the api.services.js
    //   const response = await api.post('/v1/chat/bot', data)
    //   return response.data

    // Simulating an asynchronous API call with a dummy response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                message: "Hello dev 🫣, this is a static response for now.",
            });
        }, 500); // Simulating a 500ms delay
    });
}
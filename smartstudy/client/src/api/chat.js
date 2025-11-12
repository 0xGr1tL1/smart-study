import api from './axios'
export async function sendChat(message){ const { data } = await api.post('/chatbot', { message }); return data }

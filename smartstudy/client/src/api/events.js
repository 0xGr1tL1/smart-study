import api from './axios'
export async function listEvents(){ const { data } = await api.get('/events'); return data }
export async function createEvent(body){ const { data } = await api.post('/events', body); return data }
export async function updateEvent(id, updates){ const { data } = await api.put(`/events/${id}`, updates); return data }
export async function deleteEvent(id){ const { data } = await api.delete(`/events/${id}`); return data }

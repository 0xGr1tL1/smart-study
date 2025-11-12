import api from './axios'
export async function listNotes(){ const { data } = await api.get('/notes'); return data }
export async function createNote(body){ const { data } = await api.post('/notes', body); return data }
export async function updateNote(id, updates){ const { data } = await api.put(`/notes/${id}`, updates); return data }
export async function deleteNote(id){ const { data } = await api.delete(`/notes/${id}`); return data }

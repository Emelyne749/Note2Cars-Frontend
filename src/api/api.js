import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
})

export const getNotes = () => API.get('/notes')
export const createNote = (note) => API.post('/notes', note)
export const generateFlashcards = (noteId) => API.post(`/flashcards/generate/${noteId}`)
export const getFlashcards = (noteId) => API.get(`/flashcards/note/${noteId}`)
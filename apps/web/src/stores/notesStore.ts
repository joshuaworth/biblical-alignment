'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  book: string
  chapter: number
  verse?: number
  content: string
  createdAt: string
  updatedAt: string
}

interface NotesState {
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateNote: (id: string, content: string) => void
  deleteNote: (id: string) => void
  getNotesForChapter: (book: string, chapter: number) => Note[]
  getNotesForVerse: (book: string, chapter: number, verse: number) => Note[]
  searchNotes: (query: string) => Note[]
  getNoteById: (id: string) => Note | undefined
  hasNoteForVerse: (book: string, chapter: number, verse: number) => boolean
}

function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (noteData) => {
        const id = generateId()
        const now = new Date().toISOString()
        const newNote: Note = {
          ...noteData,
          id,
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          notes: [...state.notes, newNote],
        }))
        return id
      },

      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, content, updatedAt: new Date().toISOString() }
              : note
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }))
      },

      getNotesForChapter: (book, chapter) => {
        return get().notes.filter(
          (note) =>
            note.book.toLowerCase() === book.toLowerCase() &&
            note.chapter === chapter
        )
      },

      getNotesForVerse: (book, chapter, verse) => {
        return get().notes.filter(
          (note) =>
            note.book.toLowerCase() === book.toLowerCase() &&
            note.chapter === chapter &&
            note.verse === verse
        )
      },

      searchNotes: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().notes.filter(
          (note) =>
            note.content.toLowerCase().includes(lowerQuery) ||
            note.book.toLowerCase().includes(lowerQuery)
        )
      },

      getNoteById: (id) => {
        return get().notes.find((note) => note.id === id)
      },

      hasNoteForVerse: (book, chapter, verse) => {
        return get().notes.some(
          (note) =>
            note.book.toLowerCase() === book.toLowerCase() &&
            note.chapter === chapter &&
            note.verse === verse
        )
      },
    }),
    {
      name: 'biblical-alignment-notes',
    }
  )
)

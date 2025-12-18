import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import NoteItem from '../components/NoteItem.vue'
import type { Note } from '@/types'

// Mock Stores
const updateNoteMock = vi.fn()
const deleteNoteMock = vi.fn()
const bringToFrontMock = vi.fn()
const setEditingMock = vi.fn()

vi.mock('@/stores/notes', () => ({
    useNoteStore: () => ({
        updateNote: updateNoteMock,
        deleteNote: deleteNoteMock,
        bringToFront: bringToFrontMock,
        setEditing: setEditingMock,
        getZIndex: (id: string) => 10,
    })
}))

vi.mock('@/stores/users', () => ({
    useUserStore: () => ({
        currentUser: { name: 'testuser' }
    })
}))

describe('NoteItem', () => {

    const mockNote: Note = {
        id: 'note-1',
        title: 'Test Title',
        content: 'Test Content',
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        zIndex: 1,
        updatedBy: 'testuser',
        timestamp: Date.now(),
        comments: [],
        editing: null
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('TEST renders correct title and content', () => {
        const wrapper = mount(NoteItem, {
            props: {
                note: mockNote
            }
        })

        const titleInput = wrapper.find('.note-title-input').element as HTMLInputElement
        const contentTextarea = wrapper.find('.note-textarea').element as HTMLTextAreaElement

        // Chequea si renderiza correctamente el título y el contenido de la nota
        expect(titleInput.value).toBe('Test Title')
        expect(contentTextarea.value).toBe('Test Content')
    })

    it('TEST calls bringToFront when note card is clicked', async () => {
        const wrapper = mount(NoteItem, {
            props: {
                note: mockNote
            }
        })

        await wrapper.find('.note-card').trigger('mousedown')

        // Chequea si se llama a la función bringToFront del store al hacer click en la nota
        expect(bringToFrontMock).toHaveBeenCalledWith('note-1')
    })

    it('TEST calls deleteNote when delete button is clicked', async () => {
        const wrapper = mount(NoteItem, {
            props: {
                note: mockNote
            }
        })

        await wrapper.find('.delete-btn').trigger('click')

        // Chequea si se llama a la función deleteNote del store al hacer click en el botón de eliminar
        expect(deleteNoteMock).toHaveBeenCalledWith('note-1')
    })
})

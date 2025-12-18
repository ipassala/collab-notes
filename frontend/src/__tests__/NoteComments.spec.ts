import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NoteComments from '../components/NoteComments.vue'
import type { Comment } from '@/types'

// Mock Stores
const addCommentMock = vi.fn()

vi.mock('@/stores/notes', () => ({
    useNoteStore: () => ({
        addComment: addCommentMock
    })
}))

describe('NoteComments', () => {
    const noteId = 'note-1'
    const comments: Comment[] = [
        { id: 'c1', text: 'First comment', user: 'User1', timestamp: Date.now() }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('TEST renders comments correctly', () => {
        const wrapper = mount(NoteComments, {
            props: {
                noteId,
                comments
            }
        })

        expect(wrapper.text()).toContain('First comment')
        expect(wrapper.text()).toContain('User1')
    })

    it('TEST adds a new comment when post button is clicked', async () => {
        const wrapper = mount(NoteComments, {
            props: {
                noteId,
                comments
            }
        })

        const input = wrapper.find('.comment-input')
        await input.setValue('New Comment')

        const postBtn = wrapper.find('.post-btn')
        await postBtn.trigger('click')

        // Chequea si se llamó la función para agregar nuevos comentarios del store
        expect(addCommentMock).toHaveBeenCalledWith(noteId, 'New Comment')
    })

    it('TEST emits close event when close button is clicked', async () => {
        const wrapper = mount(NoteComments, {
            props: {
                noteId,
                comments
            }
        })

        const closeBtn = wrapper.find('.close-btn')
        await closeBtn.trigger('click')

        // Chequea si se emitio el evento close
        expect(wrapper.emitted('close')).toBeTruthy()
    })
})

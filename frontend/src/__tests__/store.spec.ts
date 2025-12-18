import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNoteStore } from '@/stores/notes'
import { useUserStore } from '@/stores/users'
import { socket } from '@/stores/socket'

// Mock socket to avoid connection errors in tests
vi.mock('@/stores/socket', () => ({
    socket: {
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        connected: true
    }
}))

describe('Note Store', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        setActivePinia(createPinia())
        // Setup initial user for store logic that might depend on it
        const userStore = useUserStore()
        userStore.currentUser = { name: 'testuser' }
    })

    it('check if socket events correctly updates the store', async () => {
        const store = useNoteStore()

        // Helper to trigger an event
        const triggerEvent = (eventName: string, payload: any) => {
            const calls = (socket.on as any).mock.calls.filter((c: any) => c[0] === eventName)
            if (calls.length === 0) {
                console.warn(`No listeners found for event: ${eventName}`)
            }
            calls.forEach((c: any) => c[1](payload))
        }




        // TEST 1: Simulate loading 3 notes
        const initialNotes = [
            { id: '1', zIndex: 1, title: 'Note 1', content: 'C1', x: 0, y: 0, width: 200, height: 200, updatedBy: 'u1', timestamp: 100, comments: [], editing: null },
            { id: '2', zIndex: 2, title: 'Note 2', content: 'C2', x: 50, y: 50, width: 200, height: 200, updatedBy: 'u2', timestamp: 100, comments: [], editing: null },
            { id: '3', zIndex: 3, title: 'Note 3', content: 'C3', x: 100, y: 100, width: 200, height: 200, updatedBy: 'u3', timestamp: 100, comments: [], editing: null }
        ]

        triggerEvent('board:data', { notes: initialNotes, users: [] })

        // Wait for potential async updates
        //await new Promise(resolve => setTimeout(resolve, 0))

        // Verify store has 3 notes
        expect(store.notes.length).toBe(3)
        expect(store.notes[0]?.id).toBe('1')
        expect(store.notes[1]?.id).toBe('2')
        expect(store.notes[2]?.id).toBe('3')




        // TEST 2: Simulate modifying a note
        const updatedNote2 = { ...initialNotes[1], title: 'Updated Note 2', x: 999 }

        triggerEvent('note:updated', updatedNote2)
        await new Promise(resolve => setTimeout(resolve, 0))

        // Verify note 2 is updated in store
        const note2InStore = store.notes.find(n => n.id === '2')
        expect(note2InStore?.title).toBe('Updated Note 2')
        expect(note2InStore?.x).toBe(999)





        // TEST 3: Simulate deleting a note
        triggerEvent('note:deleted', { id: '3' })
        await new Promise(resolve => setTimeout(resolve, 0))

        // Verify note 3 is gone
        expect(store.notes.length).toBe(2)
        expect(store.notes.find(n => n.id === '3')).toBeUndefined()
    })
})

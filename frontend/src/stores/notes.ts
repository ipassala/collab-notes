import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { socket } from "./socket";
import type { Note, NoteCreatePayload, NoteUpdatePayload, NoteDeletePayload, NoteCommentPayload, NoteDeletedPayload, NoteCommentedPayload, BoardLoadPayload } from "../types";

export const useNoteStore = defineStore("notes", () => {
    const notes = ref<Note[]>([]);


    // Acciones

    function initBoard() {
        socket.emit("board:init", {});
    }

    function createNote(newNote: NoteCreatePayload) {
        socket.emit("note:create", newNote);
    }

    function updateNote(updatedNote: NoteUpdatePayload) {
        socket.emit("note:update", updatedNote);
    }

    function deleteNote(noteId: string) {
        socket.emit("note:delete", { id: noteId } as NoteDeletePayload);
    }

    function addComment(noteId: string, text: string) {
        socket.emit("note:comment", { noteId, text } as NoteCommentPayload);
    }

    function setEditing(noteId: string, isEditing: boolean) {
        socket.emit("note:editing", { noteId, isEditing });
    }

    function bringToFront(noteId: string) {
        const currentMax = Math.max(...notes.value.map((n) => n.zIndex || 0), 0);
        const newZ = currentMax + 1;
        updateNote({ id: noteId, zIndex: newZ });
    }

    function getZIndex(noteId: string): number {
        const note = notes.value.find((n) => n.id === noteId);
        return note ? note.zIndex : 1;
    }

    const maxZIndex = computed(() => Math.max(...notes.value.map((n) => n.zIndex || 0), 0));


    // Eventos

    socket.on("board:data", (payload: BoardLoadPayload) => {
        notes.value = payload.notes;
    });

    socket.on("note:created", (payload: Note) => {
        notes.value.push(payload);
        bringToFront(payload.id);
    });

    socket.on("note:updated", (payload: Note) => {
        const index = notes.value.findIndex((n) => n.id === payload.id);
        if (index !== -1) {
            notes.value[index] = payload;
        }
    });

    socket.on("note:deleted", (payload: NoteDeletedPayload) => {
        notes.value = notes.value.filter((n) => n.id !== payload.id);
    });

    socket.on("note:commented", (payload: NoteCommentedPayload) => {
        const note = notes.value.find((n) => n.id === payload.noteId);
        if (note) {
            note.comments.push(payload.comment);
        }
    });

    // Return

    return {
        notes,
        initBoard,
        createNote,
        updateNote,
        deleteNote,
        addComment,
        setEditing,
        bringToFront,
        getZIndex,
        maxZIndex,
    };
});

import { defineStore } from "pinia";
import { ref } from "vue";
import { socket } from "./socket";
import type { Note, NoteCreatePayload, NoteUpdatePayload, NoteDeletePayload, NoteCommentPayload, NoteDeletedPayload, NoteCommentedPayload, BoardLoadPayload } from "../types";

export const useNoteStore = defineStore("notes", () => {
    const notes = ref<Note[]>([]);
    const maxZIndex = ref(1);
    const zIndexMap = ref<Map<string, number>>(new Map());

    // Funciones para z-index

    function bringToFront(noteId: string) {
        maxZIndex.value += 1;
        zIndexMap.value.set(noteId, maxZIndex.value);
    }

    function getZIndex(noteId: string): number {
        return zIndexMap.value.get(noteId) || 1;
    }

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
        bringToFront,
        getZIndex,
    };
});

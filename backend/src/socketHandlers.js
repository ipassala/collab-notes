import { state } from "./data.js";
import { createNote, createComment } from "./utils.js";

export default function socketHandlers(io, socket) {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // --- 1. Registrar usuario ---
    socket.on("user:join", ({ name }) => {
        console.log(`👤 User joining: ${name} (${socket.id})`);
        state.users[socket.id] = { name };
        io.emit("presence:users", { users: Object.values(state.users) });
    });

    // --- 2. Inicializar tablero ---
    socket.on("board:init", () => {
        console.log(`📋 Board init requested by ${socket.id}`);
        socket.emit("board:data", { notes: state.notes });
    });

    // --- 3. Crear nota ---
    socket.on("note:create", (data) => {
        console.log(`📝 Creating note:`, data);
        try {
            const note = createNote({
                ...data, user:
                    state.users[socket.id]?.name || "unknown"
            });
            state.notes.push(note);
            io.emit("note:created", note);
        } catch (err) {
            socket.emit("server:error", { message: "Error creando la nota." });
        }
    });

    // --- 4. Actualizar nota ---
    socket.on("note:update", (note) => {
        console.log(`🔄 Updating note ${note.id}:`, note);
        try {
            const i = state.notes.findIndex((n) => n.id === note.id);
            if (i !== -1) {
                state.notes[i] = {
                    ...state.notes[i], ...note, updatedBy:
                        state.users[socket.id]?.name
                };
                io.emit("note:updated", state.notes[i]);
            }
        } catch (err) {
            socket.emit("server:error", {
                message: "Error actualizando la nota."
            });
        }
    });

    // --- 5. Eliminar nota ---
    socket.on("note:delete", ({ id }) => {
        console.log(`🗑️ Deleting note ${id}`);
        try {
            state.notes = state.notes.filter((n) => n.id !== id);
            io.emit("note:deleted", { id });
        } catch (err) {
            socket.emit("server:error", {
                message: "Error eliminando la nota."
            });
        }
    });

    // --- 6. Agregar comentario ---
    socket.on("note:comment", ({ noteId, text }) => {
        console.log(`💬 Adding comment to ${noteId}: ${text}`);
        try {
            const note = state.notes.find((n) => n.id === noteId);
            if (note) {
                const comment = createComment({
                    user: state.users[socket.id]?.name || "unknown",
                    text
                });
                note.comments.push(comment);
                io.emit("note:commented", { noteId, comment });
            }
        } catch (err) {
            socket.emit("server:error", {
                message: "Error agregando comentario."
            });
        }
    });

    // --- 7. Manejar bloqueo/edición ---
    socket.on("note:editing", ({ noteId, isEditing }) => {
        // console.log(`🔒 Editing state change: Node ${noteId} -> ${isEditing} by ${socket.id}`);
        try {
            const note = state.notes.find((n) => n.id === noteId);
            if (note) {
                if (isEditing) {
                    // Si intenta editar, verificamos que no esté bloqueada por otro
                    if (!note.editing || note.editing === state.users[socket.id]?.name) {
                        // Calcular nuevo z-index
                        const currentMaxResponse = state.notes.reduce((max, n) => Math.max(max, n.zIndex || 0), 0);
                        note.zIndex = currentMaxResponse + 1;

                        note.editing = state.users[socket.id]?.name || "unknown";
                        io.emit("note:updated", note);
                    }
                } else {
                    // Si deja de editar, liberamos solo si era el dueño del bloqueo
                    if (note.editing === state.users[socket.id]?.name) {
                        note.editing = null;
                        io.emit("note:updated", note);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    });

    // --- 8. Manejar desconexión ---
    socket.on("disconnect", () => {
        const userName = state.users[socket.id]?.name;

        // Liberar notas bloqueadas por este usuario
        state.notes.forEach(note => {
            if (note.editing === userName) {
                note.editing = null;
                io.emit("note:updated", note);
            }
        });

        delete state.users[socket.id];
        io.emit("presence:users", { users: Object.values(state.users) });
        console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
}


import { defineStore } from "pinia";
import { ref } from "vue";
import { socket, useSocketStore } from "./socket";
import type { User, UserJoinPayload, Board } from "../types";

export const useUserStore = defineStore("users", () => {
    const users = ref<User[]>([]);
    const currentUser = ref<User | null>(null);

    // Acciones

    function joinBoard(user: User) {
        currentUser.value = user;

        // Si no hay conexión, intenta conectar
        const socketStore = useSocketStore();
        if (!socketStore.isConnected) {
            socketStore.connect();
        }

        // Envía usuario al servidor
        socket.emit("user:join", { name: user.name } as UserJoinPayload);
    }

    // Eventos

    socket.on("board:data", (payload: { board: Board }) => {
        users.value = payload.board?.users || [];
    });

    socket.on("presence:users", (payload: { users: User[] }) => {
        users.value = payload.users;
    });

    // Return

    return {
        users,
        currentUser,
        joinBoard,
    };
});

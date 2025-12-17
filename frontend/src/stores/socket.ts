import { defineStore } from "pinia";
import { ref } from "vue";
import { io, type Socket } from "socket.io-client";

const URL = "http://localhost:3000";

export const socket: Socket = io(URL, {
    autoConnect: false,
    transports: ["websocket"],
});

export const useSocketStore = defineStore("socket", () => {
    const isConnected = ref(false);
    const error = ref<string | null>(null);

    // Acciones

    function connect() {
        if (socket.connected) return;
        socket.connect();
    }

    function disconnect() {
        if (!socket.connected) return;
        socket.disconnect();
    }

    // Eventos

    socket.on("connect", () => {
        isConnected.value = true;
        error.value = null;
    });

    socket.on("disconnect", () => {
        isConnected.value = false;
    });

    socket.on("connect_error", (err: { message: string }) => {
        error.value = `Connection error: ${err.message}`;
    });

    socket.on("server:error", (err: { code?: string; message: string }) => {
        error.value = `Server Error (${err.code || 'unknown'}): ${err.message}`;
        console.error("Socket Server Error:", err);
    });

    // Return

    return {
        isConnected,
        error,
        connect,
        disconnect,
    };
});

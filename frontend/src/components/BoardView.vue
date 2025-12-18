<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useNoteStore } from '@/stores/notes';
import NoteItem from './NoteItem.vue';
import UserList from './UserList.vue';

const noteStore = useNoteStore();

// Refs
const boardContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    // Inicializa el tablero
    noteStore.initBoard();

    // Centra el scroll al iniciar
    nextTick(() => {
        if (boardContainer.value) {
            const { scrollWidth, clientWidth, scrollHeight, clientHeight } = boardContainer.value;
            boardContainer.value.scrollLeft = (scrollWidth - clientWidth) / 2;
            boardContainer.value.scrollTop = (scrollHeight - clientHeight) / 2;
        }
    });
});

function handleCreateNote() {
    if (!boardContainer.value) 
        return;

    const { scrollLeft, scrollTop, clientWidth, clientHeight } = boardContainer.value;
    
    // Calcular el centro del área visible + offset aleatorio
    const x = scrollLeft + (clientWidth / 2) - 128 + (Math.random() * 40 - 20);
    const y = scrollTop + (clientHeight / 2) - 128 + (Math.random() * 40 - 20);

    noteStore.createNote({ x, y });
}

</script>

<template>
  <!-- Board Container -->
  <div class="board-container" ref="boardContainer">
    
    <!-- Header -->
    <div class="board-header">
        <h1 class="header-title">Team Notes</h1>
        <UserList />
    </div>

    <!-- Notes rendering -->
    <div class="notes-canvas">
        <NoteItem 
            v-for="note in noteStore.notes" 
            :key="note.id" 
            :note="note" 
        />
    </div>

    <!-- Create Note Button -->
    <button @click="handleCreateNote" class="create-button" title="Add Note">
        <span class="create-button-text">New note ✏</span>
    </button>
  </div>
</template>

<style scoped>
@import "tailwindcss";

.board-container {
    @apply 
    /* layout */
    relative w-full h-screen 
    
    /* appearance */
    bg-gray-50 
    
    /* overflow */
    overflow-auto

    /* Custom scrollbar styling */
    [scrollbar-width:thin]
    [scrollbar-color:theme(--color-gray-400/50)_transparent]

    /* Webkit scrollbar (Chrome, Safari, Edge) */
    [&::-webkit-scrollbar]:w-2.5
    [&::-webkit-scrollbar]:h-2.5
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-gray-400/40
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:border-2
    [&::-webkit-scrollbar-thumb]:border-transparent
    [&::-webkit-scrollbar-thumb]:bg-clip-padding
    [&::-webkit-scrollbar-thumb]:hover:bg-gray-400/70
    [&::-webkit-scrollbar-corner]:bg-transparent;
}

.board-header {
    @apply 
    /* position */
    fixed top-0 left-0 right-0 z-40
    
    /* layout */
    flex justify-between items-start
    
    /* spacing */
    p-4 
    
    /* interaction */
    pointer-events-none select-none;
}

.header-title {
    @apply 
    /* typography */
    text-2xl font-bold text-gray-400/50 
    
    /* interaction */
    pointer-events-auto select-none;
}

.notes-canvas {
    @apply 
    /* layout */
    relative
    
    /* Large canvas */
    min-w-[3000px]
    min-h-[3000px]

    /* grid pattern */
    bg-[radial-gradient(rgba(0,0,0,0.2)_1px,transparent_1px)]
    [background-size:20px_20px];
}

.create-button {
    @apply 
    /* position */
    fixed bottom-8 right-8 z-50
    
    /* layout */
    flex items-center justify-center 
    
    /* appearance */
    bg-blue-600 rounded-full shadow-lg text-white
    
    /* spacing */
    px-6 py-3
    
    /* interaction */
    hover:bg-blue-700 hover:scale-105 active:scale-95 
    
    /* transition */
    transform transition-all

    /* interaction */
    cursor-pointer;
}

.create-button-text {
    @apply 
    /* typography */
    font-bold text-lg leading-none;
}
</style>

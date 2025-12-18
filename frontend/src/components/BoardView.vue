<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNoteStore } from '@/stores/notes';
import NoteItem from './NoteItem.vue';
import { useUserStore } from '@/stores/users';

const noteStore = useNoteStore();
const userStore = useUserStore();

// Al montar el componente, se inicia el tablero
onMounted(() => {
    noteStore.initBoard();
});

</script>

<template>
  <!-- Board Container -->
  <div class="board-container">
    
    <!-- Background Grid -->
    <div class="board-background"></div>

    <!-- Header -->
    <div class="board-header">
        <h1 class="header-title">Team Notes</h1>
        <div class="users-list">
            <div v-for="user in userStore.users" :key="user.name" class="user-badge">
                <span class="user-name">👨 {{ user.name }}</span>
            </div>
        </div>
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
    <button @click="noteStore.createNote()" class="create-button" title="Add Note">
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
    overflow-hidden;
}

.board-background {
    @apply 
    /* position */
    absolute inset-0 
    
    /* appearance */
    opacity-[0.2];
    
    /* grid pattern */
    background-image: radial-gradient(#000 1px, transparent 1px);
    background-size: 20px 20px;
}

.board-header {
    @apply 
    /* position */
    absolute top-0 left-0 right-0 z-40
    
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

.users-list {
    @apply
    /* layout */
    flex flex-col gap-2 items-end;
}

.user-badge {
    @apply 
    /* appearance */
    bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-gray-200
    
    /* typography */
    text-sm text-gray-600 
    
    /* spacing */
    px-3 py-2
    
    /* interaction */
    pointer-events-auto
    
    /* transition */
    transition-all duration-300;

    animation: slide-in 0.3s ease-in-out;
}

@keyframes slide-in {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.user-name {
    @apply 
    /* typography */
    font-bold text-blue-600;
}

.notes-canvas {
    @apply 
    /* layout */
    w-full h-full relative;
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

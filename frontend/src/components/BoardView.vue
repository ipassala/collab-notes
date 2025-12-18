<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNoteStore } from '@/stores/notes';
import NoteItem from './NoteItem.vue';
import { useUserStore } from '@/stores/users';

const noteStore = useNoteStore();
const userStore = useUserStore();

onMounted(() => {
    noteStore.initBoard();
});

function createNote() {    
    // Create new note with random position (x, y)
    noteStore.createNote({
        title: '',
        content: '',
        x: window.innerWidth / 2 - 128 + (Math.random() * 200 - 20),
        y: window.innerHeight / 2 - 128 + (Math.random() * 200 - 20),
        updatedBy: userStore.currentUser?.name || ''
    });
}
</script>

<template>
  <!-- Board Container -->
  <div class="board-container">
    
    <!-- Background Grid -->
    <div class="board-background"></div>

    <!-- Header -->
    <div class="board-header">
        <h1 class="header-title">Collaborative Board</h1>
        <div class="user-badge">
            Logged in as <span class="user-name">{{ userStore.currentUser?.name }}</span>
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
    <button @click="createNote" class="create-button" title="Add Note">
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
    flex justify-between 
    
    /* spacing */
    p-4 
    
    /* interaction */
    pointer-events-none;
}

.header-title {
    @apply 
    /* typography */
    text-2xl font-bold text-gray-400/50 
    
    /* interaction */
    pointer-events-auto select-none;
}

.user-badge {
    @apply 
    /* appearance */
    bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-gray-200
    
    /* typography */
    text-sm text-gray-600 
    
    /* spacing */
    px-3 py-1 
    
    /* interaction */
    pointer-events-auto;
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

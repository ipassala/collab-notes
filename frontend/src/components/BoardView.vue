<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useNoteStore } from '@/stores/notes';
import NoteItem from './NoteItem.vue';
import { useUserStore } from '@/stores/users';

const noteStore = useNoteStore();
const userStore = useUserStore();

// Refs for note items to manage focus
const noteRefs = ref<Record<string, InstanceType<typeof NoteItem>>>({});

// Track if we just authorized a create to focus the next note
const isCreating = ref(false);

onMounted(() => {
    noteStore.initBoard();
});

function createEmptyNote() {
    isCreating.value = true;
    
    // Create random position slightly offset from center or visible area
    // Center of screen?
    const x = window.innerWidth / 2 - 128 + (Math.random() * 200 - 20);
    const y = window.innerHeight / 2 - 128 + (Math.random() * 200 - 20);

    noteStore.createNote({
        title: '',
        content: '',
        x: x,
        y: y,
        updatedBy: userStore.currentUser?.name || 'Anonymous'
    });
}
</script>

<template>
  <div class="relative w-full h-screen bg-gray-50 overflow-hidden">
    <!-- Grid Pattern Background for Board feel -->
    <div class="absolute inset-0 opacity-[0.03]" 
         style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;">
    </div>

    <!-- Toolbar / Header -->
    <div class="absolute top-0 left-0 right-0 p-4 pointer-events-none flex justify-between z-40">
        <h1 class="text-2xl font-bold text-gray-400/50 pointer-events-auto select-none">Collaborative Board</h1>
        <div class="bg-white/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-sm text-gray-600 pointer-events-auto border border-gray-200">
            Logged in as <span class="font-bold text-blue-600">{{ userStore.currentUser?.name }}</span>
        </div>
    </div>

    <!-- Notes Canvas -->
    <div class="w-full h-full relative">
        <NoteItem 
            v-for="note in noteStore.notes" 
            :key="note.id" 
            :ref="(el) => { if (el) noteRefs[note.id] = el as any }"
            :note="note" 
        />
    </div>

    <!-- FAB: Create Note -->
    <button 
        @click="createEmptyNote"
        class="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all z-50"
        title="Add Note"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
    </button>
  </div>
</template>

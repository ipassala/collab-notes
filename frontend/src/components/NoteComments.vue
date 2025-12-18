<script setup lang="ts">
/**
 * NoteComments Component
 * 
 * Displays a list of comments for a note and allows adding new ones.
 */
import { ref } from 'vue';
import type { Comment } from '@/types';
import { useNoteStore } from '@/stores/notes';

// Props
const props = defineProps<{
    noteId: string;
    comments: Comment[];
}>();

// Emits
// Define un emit para cerrar el overlay con una función externa
const emit = defineEmits<{
    (e: 'close'): void;
}>();

// Stores
const noteStore = useNoteStore();
const newComment = ref('');

// Methods
function addComment() {
    if (newComment.value.trim()) {
        noteStore.addComment(props.noteId, newComment.value.trim());
        newComment.value = '';
    }
}
</script>

<template>
    <!-- Overlay Container -->
    <div class="comments-overlay">
        
        <!-- Header: Title and Close Button -->
        <div class="comments-header">
            <h4 class="header-title">Comments</h4>
            <button @click="emit('close')" class="close-btn">
                <span class="close-icon-text">🔽</span>
            </button>
        </div>

        <!-- Scrollable List of Comments -->
        <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <div class="flex justify-between items-baseline mb-1">
                    <span class="user-name">{{ comment.user }}</span>
                    <span class="text-[10px] text-gray-400">{{ new Date(comment.timestamp).toLocaleString() }}</span>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
            </div>
            <!-- Empty State Message -->
            <p v-if="!comments?.length" class="empty-message">No comments yet.</p>
        </div>

        <!-- Footer: Input Area -->
        <div class="comments-footer">
            <div class="input-wrapper">
                <input 
                    v-model="newComment" 
                    @keyup.enter="addComment" 
                    type="text" 
                    class="comment-input"
                    placeholder="Write a comment..."
                >
                <button 
                @click="addComment"
                :disabled="!newComment.trim()"
                class="post-btn"
                >✔</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.comments-overlay {
    @apply 
    /* position */
    absolute inset-0 m-auto z-10
    
    /* layout */
    flex flex-col
    
    /* appearance */
    bg-white/95;
}

.comments-header {
    @apply 
    /* layout */
    flex justify-between items-center 
    
    /* appearance */
    border-b
    
    /* spacing */
    p-2;
}

.header-title {
    @apply 
    /* typography */
    font-bold text-sm text-gray-700;
}

.close-btn {
    @apply 
    /* color */
    text-gray-400 
    
    /* interaction */
    hover:text-gray-600

    /* cursor */
    cursor-pointer;
}

.close-icon-text {
    @apply 
    /* typography */
    text-sm leading-none;
}

.comments-list {
    @apply 
    /* layout */
    grow overflow-y-auto 
    
    /* spacing */
    p-2 space-y-2;
}

.comment-item {
    @apply 
    /* appearance */
    text-sm bg-gray-50 rounded
    
    /* spacing */
    p-2;
}

.user-name {
    @apply 
    /* typography */
    font-bold text-blue-600 block text-xs;
}

.comment-text {
    @apply 
    /* typography */
    text-gray-700;
}

.empty-message {
    @apply 
    /* typography */
    text-center text-gray-400 text-sm 
    
    /* spacing */
    mt-4;
}

.comments-footer {
    @apply 
    /* layout */
    p-2 border-t;
}

.input-wrapper {
    @apply 
    /* layout */
    flex space-x-2;
}

.comment-input {
    @apply 
    /* layout */
    grow 
    
    /* appearance */
    border rounded outline-none focus:border-blue-500
    
    /* typography */
    text-sm
    
    /* spacing */
    px-2 py-1;
}

.post-btn {
    @apply 
    /* typography */
    font-bold text-sm text-blue-600 hover:text-blue-800 
    
    /* disabled state */
    disabled:opacity-50

    /* cursor */
    cursor-pointer;
}
</style>

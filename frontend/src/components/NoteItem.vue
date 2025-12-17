<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Note } from '@/types';
import { useNoteStore } from '@/stores/notes';
import { useDragAndDrop } from '@/composables/useDragAndDrop';

const props = defineProps<{
  note: Note;
}>();

const noteStore = useNoteStore();
const showComments = ref(false);
const newComment = ref('');
const titleInput = ref<HTMLInputElement | null>(null);
const currentTitle = ref(props.note.title);
const currentContent = ref(props.note.content);

watch(() => props.note.title, (val) => {
    if (document.activeElement !== titleInput.value) {
        currentTitle.value = val;
    }
});

watch(() => props.note.content, (val) => {
     if (document.activeElement?.tagName !== 'TEXTAREA' || !document.activeElement?.closest('.note-' + props.note.id)) {
        currentContent.value = val;
    }
});

function updateTitle() {
    if (currentTitle.value !== props.note.title) {
        noteStore.updateNote({ id: props.note.id, title: currentTitle.value });
    }
}

function updateContent() {
    if (currentContent.value !== props.note.content) {
        noteStore.updateNote({ id: props.note.id, content: currentContent.value });
    }
}

function onNoteFocus() {
    noteStore.bringToFront(props.note.id);
}

function deleteNote() {
    noteStore.deleteNote(props.note.id);
}

function addComment() {
  if (newComment.value.trim()) {
    noteStore.addComment(props.note.id, newComment.value.trim());
    newComment.value = '';
  }
}

function toggleComments() {
    showComments.value = !showComments.value;
}

// Drag and drop logic
const { isDragging, onMouseDown } = useDragAndDrop(
  () => ({ x: props.note.x, y: props.note.y }),
  (position) => {
    props.note.x = position.x;
    props.note.y = position.y;
  },
  {
    onDragStart: () => noteStore.bringToFront(props.note.id),
    onDragEnd: (position) => {
      noteStore.updateNote({
        id: props.note.id,
        x: position.x,
        y: position.y,
      });
    },
  }
);
</script>

<template>
  <div 
    class="note-wrapper group"
    :class="`note-${note.id}`"
    :style="{ left: note.x + 'px', top: note.y + 'px', zIndex: noteStore.getZIndex(note.id) }"
  >
    <!-- Drag Handle -->
    <div class="drag-handle" title="Drag to move" @mousedown="onMouseDown">
          <span class="text-lg leading-none select-none">📌</span>
    </div>

    <!-- NOTE body -->
    <div class="note-card" @mousedown="onNoteFocus">
        <!-- Header / Title -->
        <div class="note-header">
        <!-- Editable Title -->
        <input 
            ref="titleInput"
            v-model="currentTitle"
            @focus="onNoteFocus"
            @blur="updateTitle"
            @keydown.enter="updateTitle"
            type="text"
            class="note-title-input"
            placeholder="Title"
        />
        
        <!-- Hidden Delete Button -->
        <button 
            @click="deleteNote"
            class="delete-btn"
            title="Delete Note"
        >
            <span class="text-sm leading-none">❌</span>
        </button>
        </div>

        <!-- Content -->
        <div class="note-content">
        <textarea 
            v-model="currentContent"
            @focus="onNoteFocus"
            @blur="updateContent"
            class="note-textarea"
            placeholder="Type here..."
        ></textarea>
        </div>

        <!-- Footer / Comments Trigger -->
        <div class="note-footer">
            <span class="truncate max-w-[100px]">{{ note.updatedBy ? `By: ${note.updatedBy}` : '' }}</span>
            <button @click="toggleComments" class="comment-trigger-btn">
                <span class="text-sm leading-none">🗨</span>
                <span>{{ note.comments ? note.comments.length : 0 }}</span>
            </button>
        </div>
        
        <!-- Comments Section (Overlay) -->
        <div v-if="showComments" class="comments-overlay">
            <div class="comments-header">
                <h4 class="font-bold text-sm text-gray-700">Comments</h4>
                <button @click="toggleComments" class="text-gray-400 hover:text-gray-600">
                    <span class="text-sm leading-none">❌</span>
                </button>
            </div>
            <div class="comments-list">
                <div v-for="comment in note.comments" :key="comment.id" class="comment-item">
                    <span class="font-bold text-blue-600 block text-xs">{{ comment.user }}</span>
                    <p class="text-gray-700">{{ comment.text }}</p>
                </div>
                <p v-if="!note.comments?.length" class="text-center text-gray-400 text-sm mt-4">No comments yet.</p>
            </div>
            <div class="p-2 border-t">
                <div class="flex space-x-2">
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
                    >Post</button>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

.note-wrapper {
    @apply 
    /* layout */
    absolute w-64 h-64;

    /* pop-in animation */
    animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes pop-in {
    0% {
        opacity: 0;
        transform: scale(0.5);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

.drag-handle {
    @apply 
    /* opacity animation */
    opacity-0 
    group-hover:opacity-100 
    transition-all duration-200 

    /* position */
    absolute -top-8 left-1/2 
    transform -translate-x-1/2 

    /* cursor */
    cursor-grab active:cursor-grabbing 

    /* background */
    bg-white border 
    border-gray-200 
    
    /* shadow */
    shadow-2xl
    
    /* rounded */
    rounded-full
    px-3 py-3 

    /* hover */
    hover:scale-105 z-50 
    pointer-events-auto;
}

.note-card {
    @apply 
    /* layout */
    w-full h-full flex flex-col overflow-hidden relative

    /* appearance */
    bg-yellow-100 rounded-lg 

    /* shadow & transition */
    shadow-md hover:shadow-xl transition-shadow;
}

.note-header {
    @apply 
    /* layout */
    flex justify-between items-center

    /* appearance */
    bg-yellow-200 border-b border-yellow-300 
    
    /* spacing */
    px-4 py-2;
}

.note-title-input {
    @apply 
    /* layout */
    w-full 

    /* appearance */
    bg-transparent border-none outline-none 

    /* typography */
    font-bold text-gray-800 placeholder-gray-500/50;
}

.delete-btn {
    @apply 
    /* opacity animation */
    opacity-0 group-hover:opacity-25 transition-all 
    hover:opacity-100

    /* cursor */
    cursor-pointer;
}

.note-content {
    @apply 
    /* layout */
    grow overflow-hidden flex flex-col

    /* spacing */
    p-2;
}

.note-textarea {
    @apply 
    /* layout */
    w-full h-full resize-none 

    /* appearance */
    bg-transparent outline-none 

    /* typography */
    text-gray-700 placeholder-gray-500/50;
}

.note-footer {
    @apply 
    /* layout */
    flex justify-between items-center select-none

    /* appearance */
    bg-yellow-50/80 border-t border-yellow-200 

    /* typography */
    text-xs text-gray-500 

    /* spacing */
    px-4 py-2;
}

.comment-trigger-btn {
    @apply 
    /* layout */
    flex items-center space-x-1 

    /* appearance */
    hover:bg-yellow-200 rounded transition 

    /* spacing */
    px-2 py-0.5;
}

.comments-overlay {
    @apply 
    /* position */
    absolute inset-0 z-10 
    
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
    disabled:opacity-50;
}
</style>

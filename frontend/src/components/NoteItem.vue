<script setup lang="ts">
/**
 * NoteItem Component
 * 
 * Displays a single note on the board.
 * Supports:
 * - Drag and drop (via useDragAndDrop)
 * - Editing title and content
 * - Adding and viewing comments (via NoteComments)
 * - Deleting
 */
import { ref, watch, computed } from 'vue';
import type { Note } from '@/types';
import { useNoteStore } from '@/stores/notes';
import { useUserStore } from '@/stores/users';
import { useResizable } from '@/composables/useResizable';
import { useDragAndDrop } from '@/composables/useDragAndDrop';
import NoteComments from './NoteComments.vue';

// Props
const props = defineProps<{
  note: Note; 
}>();

// Stores
const noteStore = useNoteStore();
const userStore = useUserStore();

// Refs
const titleInput = ref<HTMLInputElement | null>(null);
const contentInput = ref<HTMLTextAreaElement | null>(null);

// Local State
const currentTitle = ref(props.note.title);
const currentContent = ref(props.note.content);
const showComments = ref(false);

// Computed
const isLocked = computed(() => !!props.note.editing && props.note.editing !== userStore.currentUser?.name);

// Watcher para el título de la nota
watch(() => props.note.title, (val) => {
    if (document.activeElement !== titleInput.value)
        currentTitle.value = val;
});

// Watcher para el contenido de la nota
watch(() => props.note.content, (val) => {
    if (document.activeElement !== contentInput.value)
        currentContent.value = val;
});

// Actualiza el título de la nota en el store si ha cambiado
function updateTitle() {
    if (currentTitle.value !== props.note.title)
        noteStore.updateNote({ id: props.note.id, title: currentTitle.value });
}

// Actualiza el contenido de la nota en el store si ha cambiado
function updateContent() {
    if (currentContent.value !== props.note.content)
        noteStore.updateNote({ id: props.note.id, content: currentContent.value });
}

// Alterna la visibilidad de los comentarios
function toggleComments() {
    showComments.value = !showComments.value;
}

// Enfoca la nota y la trae al frente
function onNoteFocus() {
    noteStore.bringToFront(props.note.id);
}

// Elimina la nota actual
function deleteNote() {
    noteStore.deleteNote(props.note.id);
}

function handleFocus() {
    if (isLocked.value) return;
    noteStore.setEditing(props.note.id, true);
}

function handleBlur() {
    noteStore.setEditing(props.note.id, false);
    updateTitle();
    updateContent();
}

// Manejo del drag and drop
const { isDragging, onMouseDown } = useDragAndDrop(
  () => ({ x: props.note.x, y: props.note.y }),
  (position) => {
    props.note.x = position.x;
    props.note.y = position.y;
  },
  {
    onDragStart: () => {
        noteStore.setEditing(props.note.id, true);
    },
    onDragEnd: (position) => {
      noteStore.updateNote({
        id: props.note.id,
        x: position.x,
        y: position.y,
      });
      noteStore.setEditing(props.note.id, false);
    },
  }
);

// Manejo del redimensionamiento
const { isResizing, onResizeStart } = useResizable(
    () => ({ width: props.note.width, height: props.note.height }),
    (size) => {
        props.note.width = size.width;
        props.note.height = size.height;
    },
    isLocked,
    {
        onResizeStart: () => {
            noteStore.setEditing(props.note.id, true);
        },
        onResizeEnd: (size) => {
            noteStore.updateNote({ 
                id: props.note.id, 
                width: size.width, 
                height: size.height 
            });
            noteStore.setEditing(props.note.id, false);
        }
    }
);
</script>

<template>
  <div 
    class="note-wrapper group"
    :class="{ 
      'transition-all duration-300 ease-out': !isDragging && !isResizing,
      'select-none': note.zIndex !== noteStore.maxZIndex || isDragging || isResizing,
      'select-text': note.zIndex === noteStore.maxZIndex && !isDragging && !isResizing
    }"
    :style="{ 
        left: note.x + 'px', 
        top: note.y + 'px', 
        zIndex: noteStore.getZIndex(note.id),
        width: (note.width || 256) + 'px',
        height: (note.height || 256) + 'px'
    }"
  >
    <!-- Drag Handle -->
    <div class="drag-handle" @mousedown="!isLocked && onMouseDown($event)">
        <span>📌</span>
    </div>

    <!-- NOTE body -->
    <div class="note-card" @mousedown="onNoteFocus">
        
        <!-- NOTE header -->
        <div class="note-header">
        
            <!-- Title -->
            <input 
                ref="titleInput"
                v-model="currentTitle"
                @focus="handleFocus"
                @blur="handleBlur"
                @keydown.enter="updateTitle"
                type="text"
                class="note-title-input"  
                :class="{ 'opacity-50': isLocked }"
                :disabled="isLocked"
                placeholder="Title"
            />
            
            <!-- Delete Button -->
            <button 
                @click="deleteNote"
                class="delete-btn"
                title="Delete Note"
                v-if="!isLocked"
            >
                <span>❌</span>
            </button>

        </div>

        <!-- Content -->
        <div class="note-content relative">
            <textarea 
                ref="contentInput"
                v-model="currentContent"
                @focus="handleFocus"
                @blur="handleBlur"
                class="note-textarea"
                :disabled="isLocked"
                placeholder="Type here..."
            ></textarea>

        </div>

        <!-- Editing Overlay -->
        <Transition name="lock-fade">
            <div v-if="isLocked" class="locked-overlay">
                <div class="locked-badge">
                    <span>✏ {{ note.editing }} is typing<span class="typing-indicator"></span></span>
                </div>
            </div>
        </Transition>

        <!-- Footer / Comments Trigger -->
        <div class="note-footer">
            <div class="footer-info">
                <span v-if="note.updatedBy" class="footer-user">
                    Last updated by: {{ note.updatedBy }}
                </span>
                <span v-if="note.timestamp">
                    {{ new Date(note.timestamp).toLocaleString() }}
                </span>
            </div>
            <button @click="toggleComments" class="comment-trigger-btn">
                <span class="text-sm leading-none">🗨</span>
                <span>{{ note.comments ? note.comments.length : 0 }}</span>
            </button>
        </div>
        
        <!-- Comments Section (Overlay) -->
        <NoteComments 
            v-if="showComments" 
            :note-id="note.id" 
            :comments="note.comments" 
            @close="toggleComments"
        />
    </div>

    <!-- Resize Handle -->
    <div class="resize-handle-corner" @mousedown="onResizeStart" v-if="!isLocked"></div>
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
    opacity-0 group-hover:opacity-100 
    transition-all duration-200 

    /* position */
    absolute -top-8 left-1/2 
    transform -translate-x-1/2 

    /* cursor */
    cursor-grab active:cursor-grabbing select-none

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
    bg-yellow-100 rounded-t-lg rounded-l-lg 

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
    cursor-pointer

    /* scale */
    scale-75

    /* selection */
    select-none;
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

.footer-info {
    @apply 
    /* layout */
    flex flex-col 
    
    /* typography */
    text-[10px] text-gray-400;
}

.footer-user {
    @apply 
    /* layout */
    truncate max-w-[120px];
}

.locked-overlay {
    @apply 
    /* layout */
    absolute inset-0 flex items-center justify-center z-20
    
    /* glass effect */
    backdrop-sepia-[0.15] backdrop-blur-[2px] rounded-lg;
}

.locked-badge {
    @apply 
    /* appearance */
    bg-blue-600 text-white
    
    /* shape */
    px-4 py-2 rounded-md shadow-md 
    
    /* typography */
    text-sm font-bold tracking-wide
    
    /* layout */
    flex items-center gap-2 select-none;
}

/* Vue Transition for Lock Overlay */
.lock-fade-enter-active,
.lock-fade-leave-active {
    transition: all 0.2s ease;
}

.lock-fade-enter-from,
.lock-fade-leave-to {
    opacity: 0;
    backdrop-filter: grayscale(0);
}

.typing-indicator::after {
    content: '';
    animation: ellipsis 1s infinite;
    display: inline-block;
    width: 12px;
    text-align: left;
}

@keyframes ellipsis {
    0% { content: ''; }
    25% { content: '.'; }
    50% { content: '..'; }
    75% { content: '...'; }
}

.resize-handle-corner {
    @apply 
    /* position */
    absolute bottom-0 right-0 w-0 h-0 
    
    /* border */
    border-b-[12px] border-l-[12px] 
    border-b-black/0 border-l-black/20 
    hover:border-l-black/40 
    rotate-180
    
    /* cursor */
    cursor-nwse-resize z-50 rounded-br-lg transition-colors duration-200;
}
</style>

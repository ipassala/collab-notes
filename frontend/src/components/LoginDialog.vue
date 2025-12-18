<script setup lang="ts">
/**
 * LoginDialog Component
 * 
 * Displays a modal for the user to enter their name and join the board.
 */
import { ref } from 'vue';
import { useUserStore } from '@/stores/users';

const userStore = useUserStore();
const username = ref('');

function join() {
  if (username.value.trim()) {
    userStore.joinBoard({ name: username.value });
  }
}
</script>

<template>
  <!-- Overlay Container -->
  <div class="dialog-overlay">
    
    <!-- Login Card -->
    <div class="dialog-card">
      
      <!-- Header -->
      <h2 class="dialog-title">Welcome!</h2>
      <p class="dialog-subtitle">Enter your name to join the collaborative board.</p>
      
      <!-- Login Form -->
      <div class="space-y-4">
        <div>
          <label for="username" class="input-label">Username</label>
          <input 
            v-model="username" 
            @keyup.enter="join"
            type="text" 
            id="username"
            class="input-field"
            placeholder="e.g. Alice"
          />
        </div>
        
        <button 
          @click="join" 
          :disabled="!username.trim()"
          class="join-btn"
        >
          Join Board
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "tailwindcss";

.dialog-overlay {
    @apply 
    /* position */
    fixed inset-0 z-50 
    
    /* layout */
    flex items-center justify-center 
    
    /* appearance */
    bg-black/50 backdrop-blur-sm;
}

.dialog-card {
    @apply 
    /* layout */
    w-full max-w-md 
    
    /* appearance */
    bg-white rounded-xl shadow-2xl 
    
    /* spacing */
    p-8 
    
    /* transitions */
    transform transition-all;
}

.dialog-title {
    @apply 
    /* typography */
    text-3xl font-bold text-gray-800 text-center 
    
    /* spacing */
    mb-6;
}

.dialog-subtitle {
    @apply 
    /* typography */
    text-sm text-gray-500 text-center 
    
    /* spacing */
    mb-8;
}

.input-label {
    @apply 
    /* typography */
    block text-sm font-medium text-gray-700 
    
    /* spacing */
    mb-1;
}

.input-field {
    @apply 
    /* layout */
    w-full 
    
    /* appearance */
    border border-gray-300 rounded-lg outline-none 
    
    /* transitions */
    transition-all 
    
    /* focus states */
    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    
    /* spacing */
    px-4 py-3 
    
    /* placeholder */
    placeholder-gray-400;
}

.join-btn {
    @apply 
    /* layout */
    w-full 
    
    /* appearance */
    bg-blue-600 text-white font-semibold rounded-lg shadow-md 
    
    /* spacing */
    py-3 px-6 
    
    /* interactions */
    hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 
    
    /* transitions */
    transition-all transform 
    
    /* disabled state */
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
}
</style>

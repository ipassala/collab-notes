<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/users';

const username = ref('');
const userStore = useUserStore();

function join() {
  if (username.value.trim()) {
    userStore.joinBoard({ name: username.value });
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all">
      <h2 class="text-3xl font-bold mb-6 text-gray-800 text-center">Welcome!</h2>
      <p class="text-gray-500 mb-8 text-center text-sm">Enter your name to join the collaborative board.</p>
      
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            v-model="username" 
            @keyup.enter="join"
            type="text" 
            id="username"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
            placeholder="e.g. Alice"
          />
        </div>
        
        <button 
          @click="join" 
          :disabled="!username.trim()"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Join Board
        </button>
      </div>
    </div>
  </div>
</template>

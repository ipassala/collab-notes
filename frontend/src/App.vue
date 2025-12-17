<script setup lang="ts">
import { useUserStore } from '@/stores/users';
import LoginDialog from './components/LoginDialog.vue';
import BoardView from './components/BoardView.vue';

const userStore = useUserStore();
</script>

<template>
  <main class="w-full h-screen font-sans antialiased text-gray-900 bg-gray-100">
    <LoginDialog v-if="!userStore.currentUser" />
    <BoardView v-else />
  </main>
</template>


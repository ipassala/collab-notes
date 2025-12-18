<script setup lang="ts">
import { useUserStore } from '@/stores/users';

const userStore = useUserStore();
</script>

<template>
    <div class="users-list">
        <div v-for="user in userStore.users" :key="user.name" class="user-badge">
            <span class="user-name">👨 {{ user.name }}</span>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

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
</style>

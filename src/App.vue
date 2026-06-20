<script setup>
  import { onMounted } from 'vue'
  import { useAuthStore } from './stores/authStore'
  import { RouterView } from 'vue-router'
  import Navbar from './components/Navbar.vue'

  const authStore = useAuthStore()
  onMounted(async () => {
    await authStore.init()
  })
</script>

<template>
  <div class="min-h-screen bg-blue-200">
    <Navbar v-if="authStore.user" />
    <RouterView />
  </div>
</template>

<style scoped></style>

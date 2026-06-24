<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)

async function handleLogout() {
    await authStore.logout()
    router.push('/login')
}
</script>

<template>
    <nav class="bg-blue-800 sticky top-0 z-50">
        <div class="flex items-center justify-between px-4 py-3">
        <img src="../assets/GamerStatisticsLogoV1.png" alt="Logo" class="h-30 object-contain" />
        
        <button @click="menuOpen = !menuOpen" class="text-white md:hidden">
            <span class="text-2xl">☰</span>
        </button>

            <div class="hidden md:flex items-center gap-6">
                <RouterLink v-if="route.path !== '/'" to="/" class="text-white hover:text-blue-200 transition-colors text-lg">Početna</RouterLink>
                <span v-else class="text-blue-300 font-semibold text-lg">Početna</span>

                <RouterLink v-if="route.path !== '/games'" to="/games" class="text-white hover:text-blue-200 transition-colors text-lg">Moje igre</RouterLink>
                <span v-else class="text-blue-300 font-semibold text-lg">Moje igre</span>

                <RouterLink v-if="route.path !== '/stats'" to="/stats" class="text-white hover:text-blue-200 transition-colors text-lg">Statistike</RouterLink>
                <span v-else class="text-blue-300 font-semibold text-lg">Statistike</span>

                <RouterLink v-if="route.path !== '/search'" to="/search" class="text-white hover:text-blue-200 transition-colors text-lg">Pretraži korisnike</RouterLink>
                <span v-else class="text-blue-300 font-semibold text-lg">Pretraži korisnike</span>

                <RouterLink v-if="route.path !== '/followers'" to="/followers" class="text-white hover:text-blue-200 transition-colors text-lg">Moji kontakti</RouterLink>
                <span v-else class="text-blue-300 font-semibold text-lg">Moji kontakti</span>

                <button @click="handleLogout" class="text-white bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded-lg transition-colors text-lg">Odjava</button>
            </div>
        </div>

        <div v-if="menuOpen" class="md:hidden flex flex-col px-4 pb-4 gap-3">
        <RouterLink v-if="route.path !== '/'" to="/" @click="menuOpen = false" class="text-white hover:text-blue-200">Početna</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Početna</span>

        <RouterLink v-if="route.path !== '/games'" to="/games" @click="menuOpen = false" class="text-white hover:text-blue-200">Moje igre</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Moje igre</span>

        <RouterLink v-if="route.path !== '/stats'" to="/stats" @click="menuOpen = false" class="text-white hover:text-blue-200">Statistike</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Statistike</span>

        <RouterLink v-if="route.path !== '/search'" to="/search" @click="menuOpen = false" class="text-white hover:text-blue-200">Pretraži korisnike</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Pretraži korisnike</span>

        <RouterLink v-if="route.path !== '/followers'" to="/followers" @click="menuOpen = false" class="text-white hover:text-blue-200">Moji kontakti</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Moji kontakti</span>

        <button @click="handleLogout" class="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors text-left">Odjava</button>
        </div>
    </nav>
</template>

<style scoped></style>
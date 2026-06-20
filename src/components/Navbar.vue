<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

async function handleLogout() {
    await authStore.logout()
    router.push('/login')
}
</script>

<template>
    <nav class="bg-blue-800 flex items-center justify-center gap-6 py-3 sticky top-0 z-50">
        <img
            src="../assets/GamerStatisticsLogoV1.png"
            alt="GamerStatistics Logo"
            class="mb-1 h-30 object-contain"
        />
        <RouterLink
            v-if="route.path !== '/'"
            to="/"
            class="text-white hover:text-blue-200 transition-colors"
        >Početna</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Početna</span>

        <RouterLink
            v-if="route.path !== '/games'"
            to="/games"
            class="text-white hover:text-blue-200 transition-colors"
        >Moje igre</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Moje igre</span>

        <RouterLink
            v-if="route.path !== '/stats'"
            to="/stats"
            class="text-white hover:text-blue-200 transition-colors"
        >Statistike</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Statistike</span>

        <RouterLink
            v-if="route.path !== '/search'"
            to="/search"
            class="text-white hover:text-blue-200 transition-colors"
        >Pretraži korisnike</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Pretraži korisnike</span>

        <RouterLink
            v-if="route.path !== '/followers'"
            to="/followers"
            class="text-white hover:text-blue-200 transition-colors"
        >Moji kontakti</RouterLink>
        <span v-else class="text-blue-300 font-semibold">Moji kontakti</span>

        <button
            @click="handleLogout"
            class="text-white bg-blue-600 hover:bg-blue-500 px-4 py-1 rounded-lg transition-colors"
        >Odjava</button>
    </nav>
</template>

<style scoped></style>
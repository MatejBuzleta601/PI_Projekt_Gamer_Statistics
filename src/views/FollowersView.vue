<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { RouterLink } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const authStore = useAuthStore()

const followers = ref([])
const following = ref([])
const loading = ref(true)

async function fetchUsers(uidList) {
    const results = []
    for (const uid of uidList) {
        const docSnap = await getDoc(doc(db, 'users', uid))
        if (docSnap.exists()) {
            results.push({ id: docSnap.id, ...docSnap.data() })
        }
    }
    return results
}

onMounted(async () => {
    const profile = authStore.userProfile
    if (profile) {
        followers.value = await fetchUsers(profile.followers || [])
        following.value = await fetchUsers(profile.following || [])
    }
    loading.value = false
})
</script>

<template>
    <div class="min-h-screen bg-blue-200">
        <br>
        <div class="max-w-3xl mx-auto px-6">
        <h1 class="text-blue-800 text-2xl font-bold mb-6">Moji kontakti</h1>

        <div v-if="loading" class="text-blue-800 text-center">
            <p>Učitavanje...</p>
        </div>

        <div v-else class="flex flex-col gap-6">
            <div class="bg-blue-800 rounded-xl p-6">
            <h2 class="text-blue-300 text-lg font-semibold mb-4">
                Pratitelji ({{ followers.length }})
            </h2>
            <ul v-if="followers.length > 0" class="flex flex-col gap-3">
                <li
                v-for="user in followers"
                :key="user.id"
                class="bg-blue-700 rounded-lg px-4 py-3"
                >
                <RouterLink
                    :to="`/profile/${user.id}`"
                    class="text-white font-semibold hover:text-blue-200 transition-colors"
                >{{ user.username }}</RouterLink>
                </li>
            </ul>
            <p v-else class="text-blue-300">Nitko te još ne prati.</p>
            </div>

            <div class="bg-blue-800 rounded-xl p-6">
            <h2 class="text-blue-300 text-lg font-semibold mb-4">
                Pratim ({{ following.length }})
            </h2>
            <ul v-if="following.length > 0" class="flex flex-col gap-3">
                <li
                v-for="user in following"
                :key="user.id"
                class="bg-blue-700 rounded-lg px-4 py-3"
                >
                <RouterLink
                    :to="`/profile/${user.id}`"
                    class="text-white font-semibold hover:text-blue-200 transition-colors"
                >{{ user.username }}</RouterLink>
                </li>
            </ul>
            <p v-else class="text-blue-300">Ne pratiš nikoga.</p>
            </div>
        </div>
        </div>
    </div>
</template>

<style scoped></style>
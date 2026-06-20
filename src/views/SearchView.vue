<script setup>
    import { ref } from 'vue'
    import { onMounted } from 'vue'
    import { useUserStore } from '../stores/userStore'
    import { useAuthStore } from '../stores/authStore'
    import { RouterLink } from 'vue-router'

    const userStore = useUserStore()
    const authStore = useAuthStore()

    const searchQuery = ref('')

    async function handleSearch() {
        await userStore.searchUsers(searchQuery.value)
    }

    function isFollowing(uid) {
        return authStore.userProfile?.following?.includes(uid)
    }

    async function handleFollow(uid) {
        if (isFollowing(uid)) {
            await userStore.unfollowUser(uid)
        } else {
            await userStore.followUser(uid)
        }
    }

    onMounted(() => {
        userStore.clearSearch()
    })
</script>

<template>
    <div class="min-h-screen bg-blue-200">
        <br>
        <div class="max-w-3xl mx-auto px-6">
        <h1 class="text-blue-800 text-2xl font-bold mb-4">Pretraži korisnike</h1>

        <input
            v-model="searchQuery"
            type="text"
            placeholder="Pretraži po korisničkom imenu..."
            @input="handleSearch"
            class="w-full bg-blue-800 text-white placeholder-blue-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />

        <ul v-if="userStore.searchResults.length > 0" class="flex flex-col gap-3">
            <li
            v-for="user in userStore.searchResults"
            :key="user.id"
            class="bg-blue-800 rounded-xl px-6 py-4 flex items-center justify-between"
            >
            <RouterLink
                :to="`/profile/${user.id}`"
                class="text-white font-semibold hover:text-blue-200 transition-colors"
            >{{ user.username }}</RouterLink>
            <button
                @click="handleFollow(user.id)"
                :class="[
                'text-white text-sm px-4 py-1 rounded-lg transition-colors font-semibold',
                isFollowing(user.id)
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-blue-500 hover:bg-blue-400'
                ]"
            >{{ isFollowing(user.id) ? 'Unfollow' : 'Follow' }}</button>
            </li>
        </ul>

        <p v-else-if="searchQuery.length >= 2" class="text-blue-800 text-center mt-4">
            Nema rezultata.
        </p>
        </div>
    </div>
</template>

<style scoped></style>
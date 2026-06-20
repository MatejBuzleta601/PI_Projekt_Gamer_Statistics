<script setup>
    import { onMounted, computed, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { useUserStore } from '../stores/userStore'
    import { useAuthStore } from '../stores/authStore'
    import StatsChart from '../components/StatsChart.vue'

    const route = useRoute()
    const userStore = useUserStore()
    const authStore = useAuthStore()
    const loading = ref(true)

    const isFollowing = computed(() => {
        return authStore.userProfile?.following?.includes(route.params.uid)
    })

    const topGames = computed(() => {
        return [...userStore.viewedGames]
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 3)
    })

    const topGenres = computed(() => {
        const genreMap = {}
        userStore.viewedGames.forEach((game) => {
            if (genreMap[game.genre]) {
                genreMap[game.genre] += game.hours
            } else {
                genreMap[game.genre] = game.hours
            }
        })
        return Object.entries(genreMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([genre, hours]) => ({ genre, hours }))
    })

    const totalHours = computed(() => {
        return userStore.viewedGames.reduce((sum, game) => sum + game.hours, 0)
    })

    async function handleFollow() {
        if (isFollowing.value) {
            await userStore.unfollowUser(route.params.uid)
        } else {
            await userStore.followUser(route.params.uid)
        }
    }

    onMounted(async () => {
        await userStore.fetchUserProfile(route.params.uid)
        await userStore.fetchUserGames(route.params.uid)
        loading.value = false
    })
</script>

<template>
    <div class="min-h-screen bg-blue-200">
        <br>
        <div class="max-w-3xl mx-auto px-6">
        <div v-if="loading" class="text-blue-800 text-center">
            <p>Učitavanje...</p>
        </div>

        <div v-else-if="userStore.viewedProfile">
            <div class="bg-blue-800 rounded-xl p-6 mb-6">
            <h1 class="text-blue-200 text-3xl font-bold mb-2">
                {{ userStore.viewedProfile.username }}
            </h1>
            <div class="flex gap-6 mb-4">
                <p class="text-blue-300 text-sm">
                Pratitelji: <span class="text-white font-semibold">{{ userStore.viewedProfile.followers?.length || 0 }}</span>
                </p>
                <p class="text-blue-300 text-sm">
                Prati: <span class="text-white font-semibold">{{ userStore.viewedProfile.following?.length || 0 }}</span>
                </p>
            </div>
            <button
                @click="handleFollow"
                :class="[
                'text-white text-sm px-6 py-2 rounded-lg transition-colors font-semibold',
                isFollowing
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-blue-500 hover:bg-blue-400'
                ]"
            >{{ isFollowing ? 'Unfollow' : 'Follow' }}</button>
            </div>

            <div v-if="isFollowing" class="flex flex-col gap-6">
                <div class="bg-blue-800 rounded-xl p-6">
                    <h2 class="text-blue-300 text-lg font-semibold mb-4">Statistike</h2>
                    <p class="text-white text-2xl font-bold mb-4">{{ totalHours }} sati ukupno</p>

                    <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 class="text-blue-300 font-semibold mb-3">Top 3 igre</h3>
                        <ol class="flex flex-col gap-3">
                        <li v-for="(game, index) in topGames" :key="game.id" class="flex items-center gap-4">
                            <span class="text-blue-400 font-bold text-xl w-6">{{ index + 1 }}</span>
                            <span class="text-white font-semibold">{{ game.name }}</span>
                            <span class="text-blue-300 ml-auto">{{ game.hours }} sati</span>
                        </li>
                        </ol>
                    </div>
                    <div>
                        <h3 class="text-blue-300 font-semibold mb-3">Graf igara</h3>
                        <StatsChart type="bar" :data="topGames" />
                    </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-blue-300 font-semibold mb-3">Top 3 žanra</h3>
                        <ol class="flex flex-col gap-3">
                        <li v-for="(genre, index) in topGenres" :key="genre.genre" class="flex items-center gap-4">
                            <span class="text-blue-400 font-bold text-xl w-6">{{ index + 1 }}</span>
                            <span class="text-white font-semibold">{{ genre.genre }}</span>
                            <span class="text-blue-300 ml-auto">{{ genre.hours }} sati</span>
                        </li>
                        </ol>
                    </div>
                    <div>
                        <h3 class="text-blue-300 font-semibold mb-3">Raspodjela žanrova</h3>
                        <StatsChart type="doughnut" :data="topGenres" />
                    </div>
                    </div>
                </div>

                <div class="bg-blue-800 rounded-xl p-6">
                    <h2 class="text-blue-300 text-lg font-semibold mb-4">Kolekcija igara</h2>
                    <ul class="flex flex-col gap-4">
                    <li v-for="game in userStore.viewedGames" :key="game.id" class="flex items-center gap-4">
                        <img v-if="game.image" :src="game.image" :alt="game.name" class="h-16 w-28 object-cover rounded-lg" />
                        <div class="flex-1">
                        <p class="text-white font-semibold">{{ game.name }}</p>
                        <p class="text-blue-300 text-sm">{{ game.genre }} — {{ game.hours }} sati</p>
                        <span
                            :class="[
                            'text-white text-xs px-2 py-1 rounded-lg mt-1 inline-block',
                            game.status === 'backlog' ? 'bg-red-800' :
                            game.status === 'playing' ? 'bg-yellow-700' :
                            'bg-green-700'
                            ]"
                        >
                            {{ game.status === 'backlog' ? 'U backlogu' : game.status === 'playing' ? 'Trenutno igra' : 'Odigrano' }}
                        </span>
                        </div>
                    </li>
                    </ul>
                </div>
            </div>

            <p v-else class="bg-blue-800 rounded-xl p-6 text-blue-300 text-center">
            Prati ovog korisnika da vidiš njegovu kolekciju i statistike.
            </p>
        </div>
        </div>
        <br>
        <br>
    </div>
</template>

<style scoped></style>
<script setup>
    import { useGameStore } from '../stores/gameStore'
    import { onMounted, ref } from 'vue'
    import StatsChart from '../components/StatsChart.vue'

    const gameStore = useGameStore()
    const loading = ref(true)

    onMounted(async () => {
        await gameStore.fetchGames()
        loading.value = false
    })
</script>

<template>
    <div class="min-h-screen bg-blue-200">
        <br>
        <div class="max-w-3xl mx-auto px-6">
        <h1 class="text-blue-800 text-2xl font-bold mb-6">Statistike</h1>

        <div v-if="loading" class="text-blue-800 text-center">
            <p>Učitavanje...</p>
        </div>

        <div v-else-if="gameStore.games.length === 0" class="bg-blue-800 rounded-xl p-6">
            <p class="text-blue-300 text-center">Nemaš još dodanih igara.</p>
        </div>

        <div v-else class="flex flex-col gap-6">
            <div class="bg-blue-800 rounded-xl p-6">
                <h2 class="text-blue-300 text-lg font-semibold mb-2">Ukupno uloženih sati</h2>
                <p class="text-white text-3xl font-bold">{{ gameStore.totalHours }} sati</p>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="bg-blue-800 rounded-xl p-6">
                <h2 class="text-blue-300 text-lg font-semibold mb-4">Top 3 igre</h2>
                <ol class="flex flex-col gap-3">
                    <li
                    v-for="(game, index) in gameStore.topGames"
                    :key="game.id"
                    class="flex items-center gap-4"
                    >
                    <span class="text-blue-400 font-bold text-xl w-6">{{ index + 1 }}</span>
                    <span class="text-white font-semibold">{{ game.name }}</span>
                    <span class="text-blue-300 ml-auto">{{ game.hours }} sati</span>
                    </li>
                </ol>
                </div>

                <div class="bg-blue-800 rounded-xl p-6">
                <h2 class="text-blue-300 text-lg font-semibold mb-4">Graf igara</h2>
                <StatsChart type="bar" :data="gameStore.topGames" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="bg-blue-800 rounded-xl p-6">
                <h2 class="text-blue-300 text-lg font-semibold mb-4">Top 3 žanra</h2>
                <ol class="flex flex-col gap-3">
                    <li
                    v-for="(genre, index) in gameStore.topGenres"
                    :key="genre.genre"
                    class="flex items-center gap-4"
                    >
                    <span class="text-blue-400 font-bold text-xl w-6">{{ index + 1 }}</span>
                    <span class="text-white font-semibold">{{ genre.genre }}</span>
                    <span class="text-blue-300 ml-auto">{{ genre.hours }} sati</span>
                    </li>
                </ol>
                </div>

                <div class="bg-blue-800 rounded-xl p-6">
                <h2 class="text-blue-300 text-lg font-semibold mb-4">Raspodjela žanrova</h2>
                <StatsChart type="doughnut" :data="gameStore.topGenres" />
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<style scoped></style>
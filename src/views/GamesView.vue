<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { onMounted } from 'vue'

const gameStore = useGameStore()

const searchQuery = ref('')
const selectedName = ref('')
const selectedGenre = ref('')
const selectedImage = ref('')
const hours = ref('')
const showDropdown = ref(false)
const editingGameId = ref(null)
const editHours = ref(0)
const openStatusId = ref(null)

async function handleSearch() {
    await gameStore.searchGames(searchQuery.value)
    showDropdown.value = gameStore.searchResults.length > 0
}

function selectGame(game) {
    selectedName.value = game.name
    selectedGenre.value = game.genre
    selectedImage.value = game.image
    searchQuery.value = game.name
    showDropdown.value = false
}

function startEdit(game) {
    editingGameId.value = game.id
    editHours.value = game.hours
}

function toggleStatus(gameId) {
    openStatusId.value = openStatusId.value === gameId ? null : gameId
}

async function selectStatus(gameId, status) {
    await gameStore.updateGameStatus(gameId, status)
    openStatusId.value = null
}

async function saveHours(gameId) {
    await gameStore.updateGameHours(gameId, editHours.value)
    editingGameId.value = null
}

async function handleAddGame() {
    if (!selectedName.value || !selectedGenre.value) return
    if (Number(hours.value) < 0) return
    await gameStore.addGame(selectedName.value, selectedGenre.value, hours.value || 0, selectedImage.value)
    searchQuery.value = ''
    selectedName.value = ''
    selectedGenre.value = ''
    hours.value = ''
    selectedImage.value = ''
}

onMounted(() => {
    gameStore.fetchGames()
})
</script>

<template>
    <div class="min-h-screen bg-blue-200">
        <br>
        <div class="max-w-3xl mx-auto px-6">
            <h1 class="text-blue-800 text-2xl font-bold mb-4">Moje igre</h1>

            <div class="relative mb-6">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Pretraži igru..."
                    @input="handleSearch"
                    class="w-full bg-blue-800 text-white placeholder-blue-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ul v-if="showDropdown" class="absolute w-full bg-blue-700 rounded-lg mt-1 z-10">
                    <li
                        v-for="game in gameStore.searchResults"
                        :key="game.name"
                        @click="selectGame(game)"
                        class="text-white px-4 py-2 hover:bg-blue-600 cursor-pointer rounded-lg transition-colors"
                    >
                        {{ game.name }} — {{ game.genre }}
                    </li>
                </ul>
            </div>

            <div v-if="selectedName" class="bg-blue-800 rounded-xl p-6 mb-6">
                <p class="text-blue-300">Igra: <span class="text-white font-semibold">{{ selectedName }}</span></p>
                <p class="text-blue-300 mt-1">Žanr: <span class="text-white font-semibold">{{ selectedGenre }}</span></p>
                <input
                    v-model="hours"
                    type="number"
                    min="0"
                    placeholder="Broj sati"
                    class="mt-4 w-full bg-blue-700 text-white placeholder-blue-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    @click="handleAddGame"
                    class="mt-4 w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-colors"
                >Dodaj igru</button>
            </div>

            <p v-if="gameStore.error" class="text-red-500 mb-4">{{ gameStore.error }}</p>

            <div v-if="gameStore.games.length > 0">
                <h2 class="text-blue-800 text-xl font-bold mb-4">Dodane igre</h2>
                <ul class="flex flex-col gap-4">
                    <li
                        v-for="game in gameStore.games"
                        :key="game.id"
                        class="bg-blue-800 rounded-xl p-4 flex items-center gap-4"
                    >
                        <img
                            v-if="game.image"
                            :src="game.image"
                            :alt="game.name"
                            class="h-16 w-28 object-cover rounded-lg"
                        />
                        <div class="flex-1">
                            <p class="text-white font-semibold">{{ game.name }}</p>
                            <p class="text-blue-300 text-sm">{{ game.genre }} — {{ game.hours }} sati</p>

                            <div class="mt-2 flex items-center gap-2 flex-wrap">
                                <span v-if="editingGameId === game.id" class="flex items-center gap-2">
                                    <input
                                        v-model="editHours"
                                        type="number"
                                        min="0"
                                        class="bg-blue-700 text-white rounded-lg px-2 py-1 w-24 outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button
                                        @click="saveHours(game.id)"
                                        class="bg-blue-500 hover:bg-blue-400 text-white text-sm px-3 py-1 rounded-lg transition-colors"
                                    >Spremi</button>
                                    <button
                                        @click="editingGameId = null"
                                        class="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded-lg transition-colors"
                                    >Odustani</button>
                                </span>
                                <button
                                    v-else
                                    @click="startEdit(game)"
                                    class="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded-lg transition-colors"
                                >Uredi sate</button>

                                <div class="relative">
                                    <button
                                        :disabled="game.hours === 0"
                                        @click="toggleStatus(game.id)"
                                        :class="[
                                        'text-white text-sm rounded-lg px-3 py-1 disabled:opacity-50 transition-colors',
                                        game.status === 'backlog' ? 'bg-red-800 hover:bg-red-700' :
                                        game.status === 'playing' ? 'bg-yellow-700 hover:bg-yellow-600' :
                                        'bg-green-700 hover:bg-green-600'
                                        ]"
                                    >
                                        {{ game.status === 'backlog' ? 'U backlogu' : game.status === 'playing' ? 'Trenutno igram' : 'Odigrano' }}
                                    </button>

                                    <div
                                        v-if="openStatusId === game.id"
                                        class="absolute z-10 mt-1 bg-blue-800 rounded-lg overflow-hidden shadow-lg"
                                    >
                                        <button
                                        @click="selectStatus(game.id, 'backlog')"
                                        class="block w-full text-left px-4 py-2 text-white text-sm bg-red-800 hover:bg-red-700 transition-colors"
                                        >U backlogu</button>
                                        <button
                                        @click="selectStatus(game.id, 'playing')"
                                        class="block w-full text-left px-4 py-2 text-white text-sm bg-yellow-700 hover:bg-yellow-600 transition-colors"
                                        >Trenutno igram</button>
                                        <button
                                        @click="selectStatus(game.id, 'completed')"
                                        class="block w-full text-left px-4 py-2 text-white text-sm bg-green-700 hover:bg-green-600 transition-colors"
                                        >Odigrano</button>
                                    </div>
                                    </div>

                                <button
                                    @click="gameStore.deleteGame(game.id)"
                                    class="bg-red-600 hover:bg-red-500 text-white text-sm px-3 py-1 rounded-lg transition-colors"
                                >Ukloni</button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
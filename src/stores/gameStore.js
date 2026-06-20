import { defineStore } from 'pinia'
import { ref } from 'vue'
import { computed } from 'vue'
import { db } from '../firebase'
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    orderBy,
    updateDoc
} from 'firebase/firestore'
import { useAuthStore } from './authStore'

const RAWG_KEY = '151f5d1c473e442084cdf7770dd604a1'

export const useGameStore = defineStore('game', () => {
    const games = ref([])
    const searchResults = ref([])
    const error = ref(null)

    const topGames = computed(() => {
        return [...games.value]
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 3)
    })

    const topGenres = computed(() => {
        const genreMap = {}
        games.value.forEach((game) => {
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
        return games.value.reduce((sum, game) => sum + game.hours, 0)
    })

    async function searchGames(queryText) {
        if (queryText.length < 2) {
            searchResults.value = []
            return
        }

        try {
            const response = await fetch(
                `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${queryText}&page_size=5`
            )
            const data = await response.json()
            searchResults.value = data.results.map((game) => ({
                name: game.name,
                genre: game.genres?.[0]?.name || 'Nepoznato',
                image: game.background_image || null
            }))
        } catch (err) {
            error.value = err.message
        }
    }

    async function addGame(name, genre, hours, image) {
        const authStore = useAuthStore()
        try {
            error.value = null
            const hoursNumber = Number(hours)
            await addDoc(collection(db, 'games'), {
                userId: authStore.user.uid,
                name,
                genre,
                hours: hoursNumber,
                image: image || null,
                status: hoursNumber === 0 ? 'backlog' : 'backlog',
                createdAt: new Date(),
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            })
            await fetchGames()
        } catch (err) {
            error.value = err.message
        }
    }

    async function deleteGame(gameId) {
        try {
            await deleteDoc(doc(db, 'games', gameId))
            await fetchGames()
        } catch (err) {
            error.value = err.message
        }
    }

    async function fetchGames() {
        const authStore = useAuthStore()
        try {
            const q = query(
                collection(db, 'games'),
                where('userId', '==', authStore.user.uid),
                orderBy('hours', 'desc')
            )
            const snapshot = await getDocs(q)
            games.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (err) {
            error.value = err.message
        }
    }

    async function updateGameStatus(gameId, status) {
        try {
            await updateDoc(doc(db, 'games', gameId), { status })
            await fetchGames()
        } catch (err) {
            error.value = err.message
        }
    }

    async function updateGameHours(gameId, hours) {
        try {
            await updateDoc(doc(db, 'games', gameId), {
                hours: Number(hours)
            })
            await fetchGames()
        } catch (err) {
            error.value = err.message
        }
    }

    function resetStore() {
        games.value = []
        searchResults.value = []
        error.value = null
    }
    return {
        games,
        searchResults,
        error,
        topGames,
        topGenres,
        totalHours,
        searchGames,
        addGame,
        deleteGame,
        fetchGames,
        updateGameStatus,
        updateGameHours,
        resetStore
    }
})
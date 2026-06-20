import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebase'
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
    orderBy
} from 'firebase/firestore'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('user', () => {
    const searchResults = ref([])
    const viewedProfile = ref(null)
    const viewedGames = ref([])
    const error = ref(null)

    async function searchUsers(username) {
        if (username.length < 2) {
            searchResults.value = []
            return
        }
        try {
            const lowerUsername = username.toLowerCase()
            const q = query(
                collection(db, 'users'),
                where('usernameLower', '>=', lowerUsername),
                where('usernameLower', '<=', lowerUsername + '\uf8ff')
            )
            const snapshot = await getDocs(q)
            const authStore = useAuthStore()
            searchResults.value = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((user) => user.id !== authStore.user.uid)
        } catch (err) {
            error.value = err.message
        }
    }

    async function followUser(targetUid) {
        const authStore = useAuthStore()
        try {
            await updateDoc(doc(db, 'users', authStore.user.uid), {
                following: arrayUnion(targetUid)
            })
            await updateDoc(doc(db, 'users', targetUid), {
                followers: arrayUnion(authStore.user.uid)
            })
            await authStore.fetchUserProfile(authStore.user.uid)
        } catch (err) {
            error.value = err.message
        }
    }

    async function unfollowUser(targetUid) {
        const authStore = useAuthStore()
        try {
            await updateDoc(doc(db, 'users', authStore.user.uid), {
                following: arrayRemove(targetUid)
            })
            await updateDoc(doc(db, 'users', targetUid), {
                followers: arrayRemove(authStore.user.uid)
            })
            await authStore.fetchUserProfile(authStore.user.uid)
        } catch (err) {
            error.value = err.message
        }
    }

    async function fetchUserProfile(uid) {
        try {
            const docSnap = await getDoc(doc(db, 'users', uid))
            if (docSnap.exists()) {
                viewedProfile.value = { id: docSnap.id, ...docSnap.data() }
            }
        } catch (err) {
            error.value = err.message
        }
    }

    async function fetchUserGames(uid) {
        try {
            const q = query(
                collection(db, 'games'),
                where('userId', '==', uid),
                orderBy('hours', 'desc')
            )
            const snapshot = await getDocs(q)
            viewedGames.value = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (err) {
            error.value = err.message
        }
    }

    function clearSearch() {
        searchResults.value = []
    }

    function resetStore() {
        searchResults.value = []
        viewedProfile.value = null
        viewedGames.value = []
        error.value = null
    }
    return {
        searchResults,
        viewedProfile,
        viewedGames,
        error,
        searchUsers,
        followUser,
        unfollowUser,
        fetchUserProfile,
        fetchUserGames,
        clearSearch,
        resetStore
    }
})
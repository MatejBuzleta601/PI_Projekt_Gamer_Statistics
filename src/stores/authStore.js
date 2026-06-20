import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../firebase'
import { useGameStore } from './gameStore'
import { useUserStore } from './userStore'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const userProfile = ref(null)
    const error = ref(null)
    const authReady = ref(false)

    async function register(email, password, username) {
        try {
            error.value = null
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const uid = userCredential.user.uid

            await setDoc(doc(db, 'users', uid), {
                username,
                usernameLower: username.toLowerCase(),
                email,
                createdAt: new Date(),
                followers: [],
                following: []
            })

            user.value = userCredential.user
        } catch (err) {
            error.value = err.message
        }
    }

    async function login(email, password) {
        try {
            error.value = null
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            user.value = userCredential.user
        } catch (err) {
            error.value = err.message
        }
    }

    async function logout() {
        const gameStore = useGameStore()
        const userStore = useUserStore()
        await signOut(auth)
        user.value = null
        userProfile.value = null
        gameStore.resetStore()
        userStore.resetStore()
    }

    async function fetchUserProfile(uid) {
        const docSnap = await getDoc(doc(db, 'users', uid))
        if (docSnap.exists()) {
            userProfile.value = docSnap.data()
        }
    }

    function init() {
        return new Promise((resolve) => {
            onAuthStateChanged(auth, async (firebaseUser) => {
                if (firebaseUser) {
                    user.value = firebaseUser
                    await fetchUserProfile(firebaseUser.uid)
                } else {
                    user.value = null
                    userProfile.value = null
                }
                authReady.value = true
                resolve()
            })
        })
    }

    return {
        user,
        userProfile,
        error,
        authReady,
        register,
        login,
        logout,
        fetchUserProfile,
        init
    }
})
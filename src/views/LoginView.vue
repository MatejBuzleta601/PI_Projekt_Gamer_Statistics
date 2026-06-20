<script setup>
    import { ref } from 'vue'
    import { useAuthStore } from '../stores/authStore'
    import { useRouter } from 'vue-router'
    import { RouterLink } from 'vue-router'

    const authStore = useAuthStore()
    const router = useRouter()

    const email = ref('')
    const password = ref('')

    async function handleLogin() {
        await authStore.login(email.value, password.value)
        if (!authStore.error) {
            router.push('/')
        }
    }
</script>

<template>
    <div class="min-h-screen bg-blue-200 flex items-center justify-center">
        <div class="w-full max-w-md">
            <div class="bg-blue-800 rounded-xl p-8">
                <img
                    src="../assets/GamerStatisticsLogoV1.png"
                    alt="GamerStatistics Logo"
                    class="mb-1 h-30 object-contain"
                />
                <h1 class="text-white text-2xl font-bold mb-6 text-center">Prijava</h1>

                <div class="flex flex-col gap-4">
                    <input
                        v-model="email"
                        type="email"
                        placeholder="Email"
                        class="bg-blue-700 text-white placeholder-blue-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Lozinka"
                        class="bg-blue-700 text-white placeholder-blue-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                        @keyup.enter="handleLogin"
                    />
                    <button
                        @click="handleLogin"
                        class="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-colors"
                    >Prijavi se</button>
                </div>

                <p v-if="authStore.error" class="text-red-300 mt-4 text-center">{{ authStore.error }}</p>

                <p class="text-blue-300 mt-6 text-center">
                    Nemaš račun?
                    <RouterLink to="/register" class="text-white hover:text-blue-200 font-semibold transition-colors">
                        Registriraj se
                    </RouterLink>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>